import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateUserRequest } from './dto/update-user-request.dto';
import { CreateUserRequest } from './dto/create-user-request.dto';
import { ReadAllUsersResponse } from './dto/read-all-users-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(user: CreateUserRequest) {
    return await this.prisma.$transaction(async (prisma) => {

      const role = await prisma.role.findUnique({
        where: {
          id: user.roleId,
        },
      });

      if (!role) {
        throw new BadRequestException('Role not found');
      }

      if (role.name === 'Member' && user.password) {
        throw new BadRequestException('Members do not have access to the system! Remove the password field from the request body');
      }

      if (role.name !== 'Member' && !user.password) {
        throw new BadRequestException('Password is required');
      }

      if (user.password) {
        const userExists = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
        });

        if (userExists) {
          throw new BadRequestException('User already exists');
        }
      }

      const hashedPassword = user.password ? await argon2.hash(user.password) : null;

      const createdUser = await prisma.user.create({
        data: {
          name: user.name,
          externalId: user.externalId,
          email: user.email,
          password: hashedPassword,
          manager: {
            connect: user.managerId ? {
              id: user.managerId,
            } : undefined,
          },
          role: {
            connect: {
              id: user.roleId,
            },
          },
          area: {
            connect: {
              id: user.areaId,
            },
          },
        },
      });

      if (user.accountTypes) {
        for (const accountTypeId of user.accountTypes) {
          await prisma.userAccountTypes.create({
            data: {
              user: {
                connect: {
                  id: createdUser.id,
                },
              },
              accountType: {
                connect: {
                  id: accountTypeId,
                },
              },
            },
          });
        }
      }

      if (user.accountTypesApplications) {
        for (const accountTypeApplications of user.accountTypesApplications) {
          for (const applicationId of accountTypeApplications.applicationsId) {
            await prisma.accountTypeApplications.create({
              data: {
                user: {
                  connect: {
                    id: createdUser.id,
                  },
                },
                accountType: {
                  connect: {
                    id: accountTypeApplications.accountTypeId,
                  },
                },
                application: {
                  connect: {
                    id: applicationId,
                  },
                },
              },
            });
          }
        }
      }

      if (user.applicationsEntitlements) {
        for (const applicationEntitlement of user.applicationsEntitlements) {
          for (const entitlementId of applicationEntitlement.entitlementsId) {
            await prisma.applicationEntitlements.create({
              data: {
                user: {
                  connect: {
                    id: createdUser.id,
                  },
                },
                application: {
                  connect: {
                    id: applicationEntitlement.applicationId,
                  },
                },
                entitlement: {
                  connect: {
                    id: entitlementId,
                  },
                },
              },
            });
          }
        }
      }

      return {
        id: createdUser.id,
        externalId: createdUser.externalId,
        name: createdUser.name,
        email: createdUser.email,
        active: createdUser.active,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      }
    });
  }

  async readAllUsers(params: {
    page: number;
    limit: number;
    where: Prisma.UserWhereInput;
    orderBy: Prisma.UserOrderByWithRelationInput;
  }): Promise<ReadAllUsersResponse> {

    const { page, limit, where, orderBy } = params;

    if (page < 1 || limit < 1) {
      throw new BadRequestException('Invalid page or limit');
    }

    if (orderBy && !['id', 'name', 'createdAt', 'updatedAt'].includes(Object.keys(orderBy)[0])) {
      throw new BadRequestException('Invalid value to orderBy');
    }

    const skip = (page - 1) * limit;
    const take = limit;
    const total = await this.prisma.user.count({ where });
    const lastPage = Math.ceil(total / limit);

    const users = await this.prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        externalId: true,
        name: true,
        email: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        UserAccountTypes: {
          select: {
            accountType: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
      }
    });

    const accountTypesApplications = await this.prisma.accountTypeApplications.findMany({
      where: {
        userId: {
          in: users.map((user) => user.id),
        },
      },
      select: {
        userId: true,
        accountTypeId: true,
        accountType: {
          select: {
            id: true,
            name: true,
          },
        },
        application: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("accountTypesApplications", accountTypesApplications);

    // remove duplicates based on accountType id and application id and return only the first occurrence of each duplicate found in the array of objects
    function removeDuplicates(array, keys) {
      return array.filter((item, index, self) =>
        index === self.findIndex((t) => (
          keys.every(key => t[key] === item[key])
        ))
      );
    }
    const accountTypesApplicationsF = removeDuplicates(accountTypesApplications, ['accountTypeId', 'applicationId']);
    console.log("accountTypesApplicationsF", accountTypesApplicationsF);


    const applicationsEntitlements = await this.prisma.applicationEntitlements.findMany({
      where: {
        userId: {
          in: users.map((user) => user.id),
        },
      },
      select: {
        userId: true,
        applicationId: true,
        application: {
          select: {
            id: true,
            name: true,
          },
        },
        entitlement: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });


    return {
      users: users.map((user) => ({
        id: user.id,
        externalId: user.externalId,
        name: user.name,
        email: user.email,
        manager: user.manager,
        role: user.role,
        area: user.area,
        accountTypes: user.UserAccountTypes.map((userAccountType) => ({
          id: userAccountType.accountType.id,
          name: userAccountType.accountType.name,
          description: userAccountType.accountType.description
        })),

        accountTypesApplications: accountTypesApplicationsF
          .filter((accountTypeApplication) => accountTypeApplication.userId === user.id)
          .map((accountTypeApplication) => ({
            accountType: accountTypeApplication.accountType,
            applications: accountTypesApplications
              .filter(
                (accountTypeApplication) =>
                  accountTypeApplication.userId === user.id &&
                  accountTypeApplication.accountTypeId === accountTypeApplication.accountType.id
              )
              .map((accountTypeApplication) => (accountTypeApplication.application)),
          })),

        applicationsEntitlements: applicationsEntitlements
          .filter((applicationEntitlement) => applicationEntitlement.userId === user.id)
          .map((applicationEntitlement) => ({
            application: applicationEntitlement.application,
            entitlements: applicationsEntitlements
              .filter(
                (applicationEntitlement) =>
                  applicationEntitlement.userId === user.id &&
                  applicationEntitlement.applicationId === applicationEntitlement.application.id
              )
              .map((applicationEntitlement) => ({
                id: applicationEntitlement.entitlement.id,
                name: applicationEntitlement.entitlement.name,
              })),
          })),
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      meta: {
        total,
        currentPage: page,
        lastPage,
        limit,
        prev: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
        next: page < lastPage ? `?page=${page + 1}&limit=${limit}` : null,
      },
    };
  }

  async findOne(id: string){
    return 'method not implemented';
  }
  
  //   async findOne(id: string): Promise<ReadOneUserDto> {
  //     const user = await this.prisma.user.findUnique({
  //       where: {
  //         id,
  //         active: true,
  //         removed: false,
  //       },
  //       select: {
  //         id: true,
  //         externalId: true,
  //         name: true,
  //         email: true,
  //         active: true,
  //         removed: true,
  //         createdAt: true,
  //         updatedAt: true,
  //         TypeAccount: {
  //           select: {
  //             id: true,
  //             name: true,
  //             description: true,
  //           },
  //         },
  //         manager: {
  //           select: {
  //             id: true,
  //             name: true,
  //           },
  //         },
  //         role: {
  //           select: {
  //             id: true,
  //             name: true,
  //             description: true,
  //           },
  //         },
  //         area: {
  //           select: {
  //             id: true,
  //             name: true,
  //             description: true,
  //           },
  //         },
  //         UserApplication: {
  //           select: {
  //             application: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 description: true,
  //               },
  //             },
  //             accessType: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 description: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //     if (!user) {
  //       throw new BadRequestException('User not found');
  //     }

  //     return {
  //       id: user.id,
  //       externalId: user.externalId,
  //       name: user.name,
  //       email: user.email,
  //       typeAccount: user.TypeAccount,
  //       manager: user.manager,
  //       role: user.role,
  //       area: user.area,
  //       appAccessType: user.UserApplication.map((userApplication) => ({
  //         application: userApplication.application,
  //         accessType: userApplication.accessType,
  //       })),
  //       active: user.active,
  //       removed: user.removed,
  //       createdAt: user.createdAt,
  //       updatedAt: user.updatedAt,
  //     };
  //   }

  //   async update(id: string, user: UpdateUserDto) {

  //     const userExists = await this.prisma.user.findUnique({
  //       where: {
  //         id,
  //       },
  //     });

  //     if (!userExists) {
  //       throw new BadRequestException('User not found');
  //     }

  //     return await this.prisma.$transaction(async (prisma) => {

  //       if (user.password) {
  //         user.password = await argon2.hash(user.password);
  //       }

  //       const updatedUser = await prisma.user.update({
  //         where: {
  //           id,
  //         },
  //         data: {
  //           name: user.name,
  //           email: user.email,
  //           password: user.password,
  //           managerId: user.managerId,
  //           roleId: user.roleId,
  //           areaId: user.areaId,
  //           active: user.active,
  //           removed: user.removed,
  //         },
  //       });

  //       if (user.appAccessType) {
  //         for (const appAccessType of user.appAccessType) {
  //           await prisma.userApplication.upsert({
  //             where: {
  //               userId_applicationId_accessTypeId: {
  //                 userId: updatedUser.id,
  //                 applicationId: appAccessType.applicationId,
  //                 accessTypeId: appAccessType.accessTypeId,
  //               },
  //             },
  //             update: {},
  //             create: {
  //               userId: updatedUser.id,
  //               applicationId: appAccessType.applicationId,
  //               accessTypeId: appAccessType.accessTypeId,
  //             },
  //           });
  //         }
  //       }

  //       return {
  //         id: updatedUser.id,
  //         name: updatedUser.name,
  //         email: updatedUser.email,
  //         managerId: updatedUser.managerId,
  //         roleId: updatedUser.roleId,
  //         areaId: updatedUser.areaId,
  //         active: updatedUser.active,
  //         removed: updatedUser.removed,
  //         createdAt: updatedUser.createdAt,
  //         updatedAt: updatedUser.updatedAt,
  //       }
  //     });
  //   }

  //   async createUserApplications(id: string, userApplications: CreateUserApplicationsDto) {
  //     return await this.prisma.$transaction(async (prisma) => {

  //       const userExists = await prisma.user.findUnique({
  //         where: {
  //           id,
  //         },
  //       });

  //       if (!userExists) {
  //         throw new BadRequestException('User not found');
  //       }

  //       await prisma.userApplication.createMany({
  //         data: userApplications.appAccessType.map((appAccessType) => ({
  //           userId: id,
  //           applicationId: appAccessType.applicationId,
  //           accessTypeId: appAccessType.accessTypeId,
  //         })),
  //       });
  //     });
  //   }

  /*
    This method don´t have pagination at the request of the frontend developer
  */
  //   async findAllManagers() {

  //     const managerRole = await this.prisma.role.findFirst({
  //       where: {
  //         name: 'Manager',
  //       },
  //       select: {
  //         id: true,
  //       },
  //     });

  //     return await this.prisma.user.findMany({
  //       where: {
  //         active: true,
  //         removed: false,
  //         roleId: managerRole.id,
  //       },
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //     });
  //   }

  async update(id: string, user: UpdateUserRequest) {
    return 'method not implemented';
  }
}
