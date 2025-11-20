import { PrismaClient } from '@prisma/client';
import { CreatePregameInput, JoinRequestInput } from '../validators/pregame.validator';

const prisma = new PrismaClient();

export class PregameService {
  async createPregame(data: CreatePregameInput, hostId: string) {
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const pregame = await prisma.pregame.create({
      data: {
        title: data.title,
        description: data.description,
        meetingTime: new Date(data.meetingTime),
        meetingLocation: data.meetingLocation,
        accessType: data.accessType,
        capacity: data.capacity,
        phoneNumber: data.phoneNumber,
        requirements: data.requirements,
        hostId,
        eventId: data.eventId,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            major: true,
            dorm: true,
            avatarUrl: true,
          },
        },
        event: true,
      },
    });

    return pregame;
  }

  async getPregamesByEvent(eventId: string) {
    const pregames = await prisma.pregame.findMany({
      where: { eventId },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            major: true,
            dorm: true,
            avatarUrl: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            major: true,
            dorm: true,
            year: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        meetingTime: 'asc',
      },
    });

    return pregames.map(pregame => ({
      id: pregame.id,
      title: pregame.title,
      description: pregame.description,
      meetingTime: pregame.meetingTime,
      meetingLocation: pregame.meetingLocation,
      accessType: pregame.accessType,
      capacity: pregame.capacity,
      host: pregame.host,
      attendeeCount: pregame.attendees.length,
      attendees: pregame.attendees,
    }));
  }

  async joinPregame(pregameId: string, userId: string, joinData: JoinRequestInput) {
    const pregame = await prisma.pregame.findUnique({
      where: { id: pregameId },
      include: {
        attendees: true,
      },
    });

    if (!pregame) {
      throw new Error('Pregame not found');
    }

    if (pregame.accessType !== 'OPEN') {
      throw new Error('This pregame requires a join request');
    }

    if (pregame.capacity && pregame.attendees.length >= pregame.capacity) {
      throw new Error('Pregame is at full capacity');
    }

    const isAlreadyAttending = pregame.attendees.some(
      attendee => attendee.id === userId
    );

    if (isAlreadyAttending) {
      throw new Error('You are already attending this pregame');
    }

    // For OPEN pregames, create a join request and immediately approve it
    await prisma.$transaction([
      prisma.joinRequest.create({
        data: {
          userId,
          pregameId,
          status: 'APPROVED',
          bringing: joinData.bringing,
          groupSize: joinData.groupSize,
          message: joinData.message,
          phoneNumber: joinData.phoneNumber,
        },
      }),
      prisma.pregame.update({
        where: { id: pregameId },
        data: {
          attendees: {
            connect: { id: userId },
          },
        },
      }),
    ]);

    return { message: 'Successfully joined pregame' };
  }

  async requestToJoinPregame(pregameId: string, userId: string, joinData: JoinRequestInput) {
    const pregame = await prisma.pregame.findUnique({
      where: { id: pregameId },
      include: {
        attendees: true,
        joinRequests: {
          where: {
            userId,
          },
        },
      },
    });

    if (!pregame) {
      throw new Error('Pregame not found');
    }

    if (pregame.accessType !== 'REQUEST_ONLY') {
      throw new Error('This pregame does not require a join request. Use join instead.');
    }

    const isAlreadyAttending = pregame.attendees.some(
      attendee => attendee.id === userId
    );

    if (isAlreadyAttending) {
      throw new Error('You are already attending this pregame');
    }

    if (pregame.joinRequests.length > 0) {
      throw new Error('You already have a pending request for this pregame');
    }

    const joinRequest = await prisma.joinRequest.create({
      data: {
        userId,
        pregameId,
        status: 'PENDING',
        bringing: joinData.bringing,
        groupSize: joinData.groupSize,
        message: joinData.message,
        phoneNumber: joinData.phoneNumber,
      },
    });

    return joinRequest;
  }

  async getPregameHostInfo(pregameId: string, userId: string) {
    const pregame = await prisma.pregame.findUnique({
      where: { id: pregameId },
      include: {
        host: true,
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
            major: true,
            dorm: true,
            year: true,
            avatarUrl: true,
          },
        },
        joinRequests: {
          where: {
            status: 'PENDING',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                major: true,
                dorm: true,
                year: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!pregame) {
      throw new Error('Pregame not found');
    }

    if (pregame.hostId !== userId) {
      throw new Error('Only the host can view this information');
    }

    return {
      id: pregame.id,
      title: pregame.title,
      attendees: pregame.attendees,
      joinRequests: pregame.joinRequests.map(req => ({
        id: req.id,
        user: req.user,
        status: req.status,
        createdAt: req.createdAt,
      })),
    };
  }

  async approveJoinRequest(requestId: string, hostId: string) {
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: {
        pregame: {
          include: {
            attendees: true,
          },
        },
      },
    });

    if (!joinRequest) {
      throw new Error('Join request not found');
    }

    if (joinRequest.pregame.hostId !== hostId) {
      throw new Error('Only the host can approve join requests');
    }

    if (joinRequest.status !== 'PENDING') {
      throw new Error('This request has already been processed');
    }

    if (
      joinRequest.pregame.capacity &&
      joinRequest.pregame.attendees.length >= joinRequest.pregame.capacity
    ) {
      throw new Error('Pregame is at full capacity');
    }

    await prisma.$transaction([
      prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' },
      }),
      prisma.pregame.update({
        where: { id: joinRequest.pregameId },
        data: {
          attendees: {
            connect: { id: joinRequest.userId },
          },
        },
      }),
    ]);

    return { message: 'Join request approved' };
  }

  async declineJoinRequest(requestId: string, hostId: string) {
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: {
        pregame: true,
      },
    });

    if (!joinRequest) {
      throw new Error('Join request not found');
    }

    if (joinRequest.pregame.hostId !== hostId) {
      throw new Error('Only the host can decline join requests');
    }

    if (joinRequest.status !== 'PENDING') {
      throw new Error('This request has already been processed');
    }

    await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: 'DECLINED' },
    });

    return { message: 'Join request declined' };
  }
}
