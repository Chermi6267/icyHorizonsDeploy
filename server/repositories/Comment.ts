import { IComment, ICommentModify } from "../interfaces/Comment";
import { LandmarkRepository } from "./Landmark";
import prisma from "./prismaClient";

const landmarkRepository = new LandmarkRepository();

export class CommentRepository {
  async getAllComments() {
    try {
      const comments = await prisma.comment.findMany();

      return comments;
    } catch (error) {
      throw new Error(`Repository: ${error}`);
    }
  }

  async getByLandmarkId(landmarkId: number) {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          landmarkId: landmarkId,
        },
        select: {
          text: true,
          createdAt: true,
          updatedAt: true,
          landmarkId: true,
          stars: true,
          id: true,
          user: {
            select: {
              email: true,
              profile: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      return comments;
    } catch (error) {
      throw new Error(`Repository: ${error}`);
    }
  }

  async createComment(options: IComment) {
    try {
      const [landmark, user] = await Promise.all([
        prisma.landmark.findUnique({ where: { id: options.landmarkId } }),
        prisma.user.findUnique({ where: { id: options.userId } }),
      ]);

      if (!landmark?.adminCenterId) return "LANDMARK";
      if (!user) return "USER";

      const reviewMetrics = await prisma.reviewMetrics.findUnique({
        where: { adminCenterId: landmark.adminCenterId },
      });

      const time = new Date(Date.now() + 9 * 60 * 60 * 1000);

      const comment = await prisma.comment.create({
        data: {
          text: options.text,
          stars: options.stars,
          landmarkId: options.landmarkId,
          userId: options.userId,
          createdAt: time,
          updatedAt: time,
        },
      });

      await landmarkRepository.updateTouristFlow(landmark.adminCenterId, true);

      await prisma.reviewMetrics.upsert({
        where: { adminCenterId: landmark.adminCenterId },
        update: {
          sumOfAccessibility: { increment: options.accessibility },
          sumOfImprovement: { increment: options.improvement },
          sumOfTourismInfrastructure: {
            increment: options.tourismInfrastructure,
          },
          commentsCount: { increment: 1 },
        },
        create: {
          adminCenterId: landmark.adminCenterId,
          sumOfAccessibility: options.accessibility,
          sumOfImprovement: options.improvement,
          sumOfTourismInfrastructure: options.tourismInfrastructure,
          commentsCount: 1,
        },
      });

      const comments = await prisma.comment.findMany({
        where: { landmarkId: options.landmarkId },
        select: { stars: true },
      });

      const averageStars =
        comments.reduce((sum, c) => sum + Number(c.stars), 0) / comments.length;

      await prisma.landmark.update({
        where: { id: options.landmarkId },
        data: { rating: averageStars },
      });

      return comment;
    } catch (error) {
      throw new Error(`Repository: ${error}`);
    }
  }

  async modifyComment(options: ICommentModify) {
    try {
      const landmarkCandidate = await prisma.landmark.findUnique({
        where: { id: options.landmarkId },
      });

      if (landmarkCandidate === null) {
        return "LANDMARK";
      }

      const userCandidate = await prisma.user.findUnique({
        where: { id: options.userId },
      });

      if (userCandidate === null) {
        return "USER";
      }

      const commentCandidate = await prisma.comment.findFirst({
        where: {
          AND: [{ id: options.commentId }, { userId: options.userId }],
        },
      });

      if (commentCandidate === null) {
        return "COMMENT";
      }

      const comment = await prisma.comment.update({
        where: {
          id: options.commentId,
        },

        data: {
          text:
            options.text === undefined ? commentCandidate.text : options.text,
          stars:
            options.stars === undefined
              ? commentCandidate.stars
              : options.stars,
          updatedAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
        },
      });

      return comment;
    } catch (error) {
      throw new Error(`Repository: ${error}`);
    }
  }

  async deleteComment(userId: number, commentId: number) {
    try {
      const commentCandidate = await prisma.comment.findFirst({
        where: {
          AND: [{ id: commentId }, { userId: userId }],
        },
      });

      if (commentCandidate === null) {
        return "COMMENT";
      }

      const comment = await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });

      return comment;
    } catch (error) {
      throw new Error(`Repository: ${error}`);
    }
  }
}
