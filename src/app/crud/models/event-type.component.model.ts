export default {
	name: "EventType",
	generic: true,
	title: "Event Type",
	titleP: "Event Types",
	url: "/event-types",
	disableCreate: false,
	disableEdit: false,
	icon: "monitor",
	fields: [
		{
			type: "text",
			inputType: "text",
			name: "name",
			tableName: "name",
			label: "Name",
			placeholder: "Name",
			inTable: true,
			required: true
		},
	],
};
