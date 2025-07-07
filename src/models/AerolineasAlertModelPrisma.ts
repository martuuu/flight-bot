import { PrismaClient, AerolineasAlert, User, TelegramUser } from '@prisma/client';
import { DatabaseManager } from '@/database/prisma';

export interface AerolineasAlertWithRelations extends AerolineasAlert {
  user: User | null;
  telegramUser: TelegramUser | null;
}

export interface CreateAerolineasAlertData {
  origin: string;
  destination: string;
  departureDate?: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  telegramUserId: string;
  preferredTimes?: string[];
  cabinClass?: string;
  maxMiles?: number;
  maxPrice?: number;
  searchType?: string;
}

export class AerolineasAlertModelPrisma {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseManager.getInstance().getClient();
  }

  async create(data: CreateAerolineasAlertData): Promise<AerolineasAlert> {
    // First find or create telegram user
    let telegramUser = await this.prisma.telegramUser.findUnique({
      where: { telegramId: data.telegramUserId }
    });

    if (!telegramUser) {
      telegramUser = await this.prisma.telegramUser.create({
        data: {
          telegramId: data.telegramUserId,
          username: `user_${data.telegramUserId}`,
          firstName: 'User'
        }
      });
    }

    // Try to find linked user
    let user = null;
    if (telegramUser.linkedUserId) {
      user = await this.prisma.user.findUnique({
        where: { id: telegramUser.linkedUserId }
      });
    }

    // If no linked user, create a basic user record
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: `telegram_${data.telegramUserId}@temp.com`,
          name: telegramUser.firstName || 'User',
          telegramId: data.telegramUserId,
          telegramLinked: true,
          telegramLinkedAt: new Date()
        }
      });

      // Update telegram user with linking
      await this.prisma.telegramUser.update({
        where: { id: telegramUser.id },
        data: {
          linkedUserId: user.id,
          isLinked: true
        }
      });
    }

    // Create the AerolineasAlert
    const alert = await this.prisma.aerolineasAlert.create({
      data: {
        origin: data.origin,
        destination: data.destination,
        departureDate: data.departureDate || null,
        returnDate: data.returnDate || null,
        adults: data.adults || 1,
        children: data.children || 0,
        infants: data.infants || 0,
        userId: user.id,
        telegramUserId: telegramUser.id,
        cabinClass: data.cabinClass || 'Economy',
        maxMiles: data.maxMiles || null,
        maxPrice: data.maxPrice || null,
        searchType: data.searchType || 'PROMO',
        preferredTimes: data.preferredTimes ? data.preferredTimes as any : null,
        isActive: true
      }
    });

    return alert;
  }

  async findByTelegramUserId(telegramUserId: string): Promise<AerolineasAlertWithRelations[]> {
    const alerts = await this.prisma.aerolineasAlert.findMany({
      where: {
        telegramUser: {
          telegramId: telegramUserId
        },
        isActive: true
      },
      include: {
        user: true,
        telegramUser: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return alerts as AerolineasAlertWithRelations[];
  }

  async findById(id: string): Promise<AerolineasAlertWithRelations | null> {
    const alert = await this.prisma.aerolineasAlert.findUnique({
      where: { id },
      include: {
        user: true,
        telegramUser: true
      }
    });

    return alert as AerolineasAlertWithRelations | null;
  }

  async update(id: string, data: Partial<CreateAerolineasAlertData>): Promise<AerolineasAlert | null> {
    try {
      const updateData: any = { ...data };
      if (data.preferredTimes) {
        updateData.preferredTimes = JSON.stringify(data.preferredTimes);
      }
      delete updateData.telegramUserId; // Don't update this field

      const alert = await this.prisma.aerolineasAlert.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });
      return alert;
    } catch (error) {
      console.error('Error updating AerolineasAlert:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.aerolineasAlert.update({
        where: { id },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      });
      return true;
    } catch (error) {
      console.error('Error deleting AerolineasAlert:', error);
      return false;
    }
  }

  async findAll(): Promise<AerolineasAlertWithRelations[]> {
    const alerts = await this.prisma.aerolineasAlert.findMany({
      where: {
        isActive: true
      },
      include: {
        user: true,
        telegramUser: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return alerts as AerolineasAlertWithRelations[];
  }

  async count(): Promise<number> {
    return await this.prisma.aerolineasAlert.count({
      where: {
        isActive: true
      }
    });
  }

  async findActiveByUser(userId: string): Promise<AerolineasAlert[]> {
    return await this.prisma.aerolineasAlert.findMany({
      where: {
        userId,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // Legacy compatibility method
  async findByUserId(userId: string): Promise<any[]> {
    // For Aerolíneas alerts, we primarily search by telegram user ID
    if (userId.match(/^\d+$/)) {
      // This looks like a telegram ID
      return await this.findByTelegramUserId(userId);
    }

    // Otherwise treat as user ID
    const alerts = await this.findActiveByUser(userId);
    return alerts.map(alert => ({
      id: alert.id,
      origin: alert.origin,
      destination: alert.destination,
      departureDate: alert.departureDate,
      returnDate: alert.returnDate,
      adults: alert.adults,
      children: alert.children,
      infants: alert.infants,
      userId: alert.userId,
      cabinClass: alert.cabinClass,
      maxMiles: alert.maxMiles,
      maxPrice: alert.maxPrice,
      searchType: alert.searchType,
      preferredTimes: alert.preferredTimes,
      isActive: alert.isActive,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt
    }));
  }
}

// Export a singleton instance for backward compatibility
export const aerolineasAlertModelPrisma = new AerolineasAlertModelPrisma();
