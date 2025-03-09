import prisma from "./prismaClient";

export class UserRepository {
  async getUserDataById(userId: number) {
    try {
      const candidate = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          profile: {
            select: {
              name: true,
              avatar: true,
              header: true,
            },
          },
          UserGroupAnalysis: {
            select: {
              name: true,
            },
          },
        },
      });

      if (candidate === null) {
        return "USER";
      }

      return candidate;
    } catch (error) {
      throw Error(`Repository: ${error}`);
    }
  }

  async changeName(userId: number, newName: string) {
    try {
      const candidate = await prisma.user.findUnique({ where: { id: userId } });

      if (candidate === null) {
        return "USER";
      }
      const result = await prisma.profile.update({
        where: { userId: userId },
        data: { name: newName },
      });

      return result;
    } catch (error) {
      throw Error(`Repository: ${error}`);
    }
  }

  async getUserGroups() {
    try {
      const result = await prisma.userGroupAnalysis.findMany();

      return result;
    } catch (error) {
      throw Error(`Repository: ${error}`);
    }
  }

  async changeUserGroup(userId: number, newGroupId: number) {
    try {
      const candidate = await prisma.user.findUnique({ where: { id: userId } });

      if (candidate === null) {
        return "USER";
      }
      const result = await prisma.user.update({
        where: { id: userId },
        data: { userGroupAnalysisId: newGroupId },
      });

      return result;
    } catch (error) {
      throw Error(`Repository: ${error}`);
    }
  }

  async changeAvatar(userId: number, fileName: string) {
    try {
      const candidate = await prisma.user.findUnique({ where: { id: userId } });

      if (candidate === null) {
        return "USER";
      }
      const result = await prisma.profile.update({
        where: { userId: userId },
        data: {
          avatar: `${process.env.IMG_URL}/user/avatar/${fileName}`,
        },
      });

      return result;
    } catch (error) {
      throw Error(`Repository: ${error}`);
    }
  }

  async changeHeader(userId: number, fileName: string) {
    try {
      const candidate = await prisma.user.findUnique({ where: { id: userId } });

      if (candidate === null) {
        return "USER";
      }
      const result = await prisma.profile.update({
        where: { userId: userId },
        data: {
          header: `${process.env.IMG_URL}/user/header/${fileName}`,
        },
      });

      return result;
    } catch (error) {
      throw Error(`Repository: ${error}`);
    }
  }

  async getUserData(userId: number) {
    try {
      const candidate = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          loggedWith: true,
          userGroupAnalysisId: true,
          profile: {
            select: {
              avatar: true,
              header: true,
              name: true,
            },
          },
        },
      });

      if (candidate === null) {
        return "USER";
      } else {
        return candidate;
      }
    } catch (error) {
      throw Error(`Repository: ${error}`);
    }
  }
}
