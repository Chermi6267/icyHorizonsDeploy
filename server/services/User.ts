import path from "path";
import { FileRepository } from "../repositories/File";
import { TokenRepository } from "../repositories/Token";
import { UserRepository } from "../repositories/User";
import { TokenService } from "./Token";
import { v4 as uuid } from "uuid";

const userRepository = new UserRepository();
const tokenService = new TokenService();
const tokenRepository = new TokenRepository();
const fileRepository = new FileRepository();

export class UserService {
  private async updateTokens(
    userId: number,
    userData: any,
    result: any
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const newAccessToken = await tokenService.generateAccessToken({
      id: userData.id,
      email: userData.email,
      role: userData.role.name,
      loggedWith: userData.loggedWith,
      avatar: result.avatar || "",
      header: result.header || "",
      name: result.name || "",
    });

    const newRefreshToken = await tokenService.generateRefreshToken({
      id: userData.id,
      email: userData.email,
      role: userData.role.name,
      loggedWith: userData.loggedWith,
      avatar: result.avatar || "",
      header: result.header || "",
      name: result.name || "",
    });

    await tokenRepository.updateRefreshSession(userId, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getUserDataById(userId: number) {
    try {
      const result = await userRepository.getUserDataById(userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUserData(userId: number) {
    try {
      const result = await userRepository.getUserData(userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUserGroups() {
    try {
      const result = await userRepository.getUserGroups();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async changeName(userId: number, newName: string) {
    try {
      const result = await userRepository.changeName(userId, newName);
      const userData = await userRepository.getUserData(userId);
      if (result === "USER" || userData === "USER") {
        return "USER";
      }

      const tokens = await this.updateTokens(userId, userData, result);

      return {
        newName: result.name,
        ...tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async changeUserGroup(userId: number, newGroupId: number) {
    try {
      const result = await userRepository.changeUserGroup(userId, newGroupId);

      if (result === "USER") {
        return "USER";
      }

      return {
        newGroupId: result.userGroupAnalysisId,
      };
    } catch (error) {
      throw error;
    }
  }

  async changeAvatar(
    userId: number,
    file: Express.Multer.File,
    oldAvatar: string
  ) {
    try {
      const fileName = `${uuid()}.${file.originalname.split(".").pop()}`;
      const result = await userRepository.changeAvatar(userId, fileName);
      const userData = await userRepository.getUserData(userId);
      if (result === "USER" || userData === "USER") {
        return "USER";
      }

      const newFilePath = path.join("public/user/avatar", fileName);
      const oldFilePath = path.join(
        "../public/user/avatar",
        oldAvatar.split("/").pop() || ""
      );
      await fileRepository
        .deleteImage(path.join(oldFilePath))
        .catch((error) => {});
      await fileRepository.saveFile(newFilePath, file.buffer);

      const tokens = await this.updateTokens(userId, userData, result);

      return {
        avatar: result.avatar,
        ...tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async changeHeader(
    userId: number,
    file: Express.Multer.File,
    oldHeader: string
  ) {
    try {
      const fileName = `${uuid()}.${file.originalname.split(".").pop()}`;
      const result = await userRepository.changeHeader(userId, fileName);
      const userData = await userRepository.getUserData(userId);
      if (result === "USER" || userData === "USER") {
        return "USER";
      }

      const newFilePath = path.join("public/user/header", fileName);
      const oldFilePath = path.join(
        "../public/user/header",
        oldHeader.split("/").pop() || ""
      );
      await fileRepository
        .deleteImage(path.join(oldFilePath))
        .catch((error) => {});
      await fileRepository.saveFile(newFilePath, file.buffer);

      const tokens = await this.updateTokens(userId, userData, result);

      return {
        header: result.header,
        ...tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async getImage(image: string) {
    try {
      const imgBuffer = await fileRepository.getIMG(image);
      return imgBuffer;
    } catch (error) {
      throw error;
    }
  }
}
