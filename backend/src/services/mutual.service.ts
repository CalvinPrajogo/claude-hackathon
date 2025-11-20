import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MutualOverlap {
  userId: string;
  name: string;
  major: string;
  dorm: string;
  year: string;
  avatarUrl: string | null;
  overlaps: string[]; // e.g., ["same dorm", "same major"]
}

export class MutualService {
  async getMutualOverlaps(
    currentUserId: string,
    targetUserIds: string[]
  ): Promise<MutualOverlap[]> {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        major: true,
        dorm: true,
        year: true,
      },
    });

    if (!currentUser) {
      throw new Error('Current user not found');
    }

    const targetUsers = await prisma.user.findMany({
      where: {
        id: {
          in: targetUserIds,
        },
      },
      select: {
        id: true,
        name: true,
        major: true,
        dorm: true,
        year: true,
        avatarUrl: true,
      },
    });

    const mutualsWithOverlaps: MutualOverlap[] = targetUsers
      .map(user => {
        const overlaps: string[] = [];

        if (user.dorm === currentUser.dorm) {
          overlaps.push('Same dorm');
        }
        if (user.major === currentUser.major) {
          overlaps.push('Same major');
        }
        if (user.year === currentUser.year) {
          overlaps.push('Same year');
        }

        return {
          userId: user.id,
          name: user.name,
          major: user.major,
          dorm: user.dorm,
          year: user.year,
          avatarUrl: user.avatarUrl,
          overlaps,
        };
      })
      .filter(user => user.overlaps.length > 0); // Only return users with at least one overlap

    return mutualsWithOverlaps;
  }

  async getMutualsInEvent(currentUserId: string, eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        pregames: {
          include: {
            attendees: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const allAttendeeIds = new Set<string>();
    event.pregames.forEach(pregame => {
      pregame.attendees.forEach(attendee => {
        if (attendee.id !== currentUserId) {
          allAttendeeIds.add(attendee.id);
        }
      });
    });

    if (allAttendeeIds.size === 0) {
      return [];
    }

    return this.getMutualOverlaps(currentUserId, Array.from(allAttendeeIds));
  }

  async getMutualsInPregame(currentUserId: string, pregameId: string) {
    const pregame = await prisma.pregame.findUnique({
      where: { id: pregameId },
      include: {
        attendees: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!pregame) {
      throw new Error('Pregame not found');
    }

    const attendeeIds = pregame.attendees
      .map(attendee => attendee.id)
      .filter(id => id !== currentUserId);

    if (attendeeIds.length === 0) {
      return [];
    }

    return this.getMutualOverlaps(currentUserId, attendeeIds);
  }
}
