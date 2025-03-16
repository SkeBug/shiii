import { PrismaClient } from "@prisma/client";
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {

    await prisma.userAccountTypes.deleteMany();
    await prisma.user.deleteMany();

    await prisma.accountType.createMany({
        data: [
            { name: "SA", description: "Service Account" },
            { name: "EA", description: "Elevate Account" },
            { name: "A", description: "Normal Account" },
            { name: "RA", description: "Robot Account" },
        ],
        skipDuplicates: true,
    });

    const typeAccount = await prisma.accountType.findUnique({
        where: {
            name: "EA",
        },
    });

    await prisma.role.createMany({
        data: [
            { name: "Admin", description: "Administrator of the system" },
            { name: "Manager", description: "Manager of the team" },
            { name: "Member", description: "Member of the team" },
        ],
        skipDuplicates: true,
    });

    await prisma.area.createMany({
        data: [
            { name: "Service Desk" },
            { name: "Development" },
            { name: "Data Center" },
            { name: "Security" }
        ],
        skipDuplicates: true,
    });

    if (!typeAccount) {
        throw new Error("Account type 'EA' not found");
    }

    await prisma.user.create({
        data: {
            name: "Graça Kinanga",
            email: "graca.kinanga@standardbank.co.ao",
            externalId: "EA12345T2",
            password: await argon2.hash("Password@123"),
            UserAccountTypes: {
                create: {
                    accountTypeId: typeAccount.id,
                },
            },
            role: {
                connect: {
                    name: "Admin",
                },
            },
            area: {
                connect: {
                    name: "Security",
                },
            },
        },  
    });

    await prisma.entitlement.createMany({
        data: [
            { name: "SB24.View", description: "View SB24" },
            { name: "SB24.Edit", description: "Edit SB24" },
        ],
        skipDuplicates: true,
    });

    await prisma.application.createMany({
        data: [
            { name: "SB24" },
            { name: "BOL" },
            { name: "Remedy" },
        ],
        skipDuplicates: true,
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });