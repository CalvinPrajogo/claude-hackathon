import { PrismaClient } from '@prisma/client';
import { CreateEventInput } from '../validators/event.validator';

const prisma = new PrismaClient();

export class EventService {
  async createEvent(data: CreateEventInput) {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        location: data.location,
        vibeTags: data.vibeTags,
        description: data.description,
        category: data.category,
      },
    });

    return event;
  }

  async getTodayEvents() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        pregames: {
          include: {
            attendees: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return events.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location,
      vibeTags: event.vibeTags,
      pregameCount: event.pregames.length,
      totalAttendees: event.pregames.reduce(
        (sum, pregame) => sum + pregame.attendees.length,
        0
      ),
    }));
  }

  async getEventById(eventId: string, currentUserId?: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        pregames: {
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
            joinRequests: {
              where: {
                status: 'PENDING',
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return {
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location,
      vibeTags: event.vibeTags,
      pregames: event.pregames.map(pregame => ({
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
        requestsPending:
          currentUserId && pregame.hostId === currentUserId
            ? pregame.joinRequests.length
            : undefined,
      })),
    };
  }
}
