import Log from "./log.component.model";
import EventType from "./event-type.component.model";
import Customer from "./customer.component.model";
import Participant from "./participant.component.model";
import Organizer from "./organizer.component.model";
import Payment from "./payments.component.model";
import Invoice from "./invoice.component.model";
import RateManagement from "./rate-management.component.model";
import Staff from "./staff.component.model";
import StaffGroup from "./staff-group.component.model";

export default {
	logs: Log,
	"event-types": EventType,
	participants: Participant,
	organizers: Organizer,
	payments: Payment,
	customers: Customer,
	invoices: Invoice,
	"rate-management":RateManagement,
	staff: Staff,
	"staff-groups": StaffGroup
};
