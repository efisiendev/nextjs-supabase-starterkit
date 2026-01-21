/**
 * JSON Event Repository Implementation
 */

import { Event, EventListItem, EventStatus, EventCategory } from '@/core/entities/Event';
import { IEventRepository } from '@/core/repositories/IEventRepository';
import eventsData from '../../../public/data/events.json';

export class JsonEventRepository implements IEventRepository {
  private async fetchEvents(): Promise<Event[]> {
    try {
      // Validate that eventsData is an array
      if (!eventsData || !Array.isArray(eventsData)) {
        throw new Error('Invalid events data format');
      }
      return eventsData as Event[];
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // TODO: Add error tracking service (e.g., Sentry)
      throw new Error('Unable to load events. Please try again later.');
    }
  }

  async getAll(): Promise<EventListItem[]> {
    const events = await this.fetchEvents();
    return events
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .map(this.toListItem);
  }

  async getByStatus(status: EventStatus): Promise<EventListItem[]> {
    const events = await this.fetchEvents();
    return events
      .filter((event) => event.status === status)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .map(this.toListItem);
  }

  async getByCategory(category: EventCategory): Promise<EventListItem[]> {
    const events = await this.fetchEvents();
    return events
      .filter((event) => event.category === category)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .map(this.toListItem);
  }

  async getUpcoming(limit: number = 6): Promise<EventListItem[]> {
    const events = await this.fetchEvents();
    const now = new Date();
    return events
      .filter((event) => new Date(event.startDate) >= now && event.status === 'upcoming')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit)
      .map(this.toListItem);
  }

  async getFeatured(limit: number = 3): Promise<EventListItem[]> {
    const events = await this.fetchEvents();
    return events
      .filter((event) => event.featured)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit)
      .map(this.toListItem);
  }

  async getBySlug(slug: string): Promise<Event | null> {
    const events = await this.fetchEvents();
    return events.find((event) => event.slug === slug) || null;
  }

  async getByDateRange(startDate: string, endDate: string): Promise<EventListItem[]> {
    const events = await this.fetchEvents();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return events
      .filter((event) => {
        const eventStart = new Date(event.startDate);
        return eventStart >= start && eventStart <= end;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .map(this.toListItem);
  }

  private toListItem(event: Event): EventListItem {
    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      category: event.category,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      coverImage: event.coverImage,
      featured: event.featured,
    };
  }
}
