import moment from "moment";

class Default {
	id?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

class Page extends Default {
	name: string;
	content: string;
}

class Log extends Default {
	name: string;
	status: string;
	description: string;
	UserId: number;
	User: User;
}

class Role extends Default {
	name: string;
	Users: User[] = [];
}

class User extends Default {
	name: string;
	email: string;
	phone: string;
	password: string;
	img: string;
	nationality: string;
	country: string;
	state: string;
	city: string;
	street: string;
	zipCode: string;
	companyName: string;
	companyPhone: string;
	website: string;
	active: boolean;
	deviceToken: string;
	currency: string;
	logo: string;
	emailTemplateImage: string;
	stripePK: string;
	RoleId: number;
	Logs: Log[] = [];
}

class Organizer extends Default {
	name: string;
	email: string;
	phone: string;
	nationality: string;
	country: string;
	state: string;
	city: string;
	street: string;
	zipCode: string;
	companyName: string;
	companyPhone: string;
	website: string;
}

class Participant extends Default {
	name: string;
	email: string;
	phone: string;
	nationality: string;
	country: string;
	state: string;
	city: string;
	street: string;
	zipCode: string;
	companyName: string;
	companyPhone: string;
	website: string;
	age: number;
	child: boolean = false;
}

class Customer extends Default {
	name: string;
	email: string;
	phone: string;
	nationality: string;
	country: string;
	state: string;
	city: string;
	street: string;
	zipCode: string;
	companyName: string;
	companyPhone: string;
	website: string;
}

class EventOrganizer extends Default {
	EventId: number;
	OrganizerId: number;
	Event: Event;
	Organizer: Organizer;
}

class EventParticipant extends Default {
	EventId: number;
	ParticipantId: number;
	Event: Event;
	Participant: Participant;
}

class EventCustomer extends Default {
	EventId: number;
	ParticipantId: number;
	Event: Event;
	Participant: Participant;
}

class EventImage extends Default {
	EventId: number;
	path: string;
}

class EventType extends Default {
	name: string;
}
// events end on/after a date or never
enum EndTypes {
	On = 'on',
	After = 'after',
	Never = 'never'
}

enum EventStatus {
	Pending = "pending",
	Started = "started",
	Ended = "ended"
}

enum IntervalTypes {
	Day = 'day',
	Week = 'week',
	Month = 'month',
	Year = 'year'
}
class EventRepeat extends Default {
	intervalType: IntervalTypes = IntervalTypes.Week;
	intervalCount: number = 1;
	days: number[] = [new Date().getDay()];
	endType: string = "never";
	endValue: any = null;
	repeatsPerDay: { startTime: Date | string; endTime: Date | string }[] = [{ startTime: new Date(), endTime: new Date() }];
}

class Location extends Default {
	name: string;
	lat: number;
	lng: number;
}
class Event extends Default {
	name: string;
	location: Location;
	status: EventStatus = EventStatus.Pending;
	description: string;
	startDate: Date | string = moment().add(1, 'day').toDate();
	endDate: Date | string = moment().add(1, 'day').toDate();
	startTime: Date | string = moment().add(1, 'hour').minutes(0).toDate();
	endTime: Date | string = moment().add(2, 'hour').minutes(0).toDate();
	price: number;
	seniorPrice: number;
	adultPrice: number;
	childPrice: number;
	studentPrice: number;
	numOfParticipants: number;
	notes: string;
	free: boolean = false;
	repeat: boolean = false;
	allDay: boolean = false;
	EventTypeId: number;
	EventType: EventType;
	EventParticipants: EventParticipant[] = [];
	EventOrganizers: EventOrganizer[] = [];
	EventCustomers: EventCustomer[] = [];
	EventImages: EventImage[] = [];
	EventRepeat: EventRepeat = new EventRepeat();
	//Virtual properties
	freeSpots: number;
	files: any[] = [];
	thumbnails: any[] = [];
	removedFiles: any[] = [];
	removedCustomers: any[] = [];
	removedOrganizers: any[] = [];
	removedParticipants: any[] = [];
	deleteType: "self" | "all" = "self";
	updateType: "self" | "all" = "self";
}

class CalendarSettings {
	columns: number = 30;
	maxColumns: number = 30;
	minColumns: number = 1;
}

export {
	Default,
	Log,
	Role,
	User,
	CalendarSettings,
	Page,
	EventType,
	EndTypes,
	EventStatus,
	IntervalTypes,
	Event,
	Customer,
	Participant,
	Organizer,
	EventParticipant,
	EventOrganizer,
	EventCustomer,
	EventImage,
	Location
};
