export default {
	name: "Log",
	generic: true,
	title: "Log",
	titleP: "Logs",
	url: "/logs",
	disableCreate: true,
	disableEdit: true,
	icon: "monitor",
	fields: [
		{
			type: "text",
			inputType: "text",
			name: "id",
			tableName: "id",
			label: "ID",
			placeholder: "ID",
			inTable: true,
		},
		{
			type: "text",
			inputType: "text",
			name: "name",
			tableName: "name",
			label: "Operation Name",
			placeholder: "Operation Name",
			inTable: true,
		},
		{
			type: "text",
			inputType: "text",
			name: "description",
			tableName: "description",
			label: "Operation Description",
			placeholder: "Operation Description",
			inTable: true,
		},
		{
			type: "text",
			inputType: "text",
			name: "status",
			tableName: "status",
			label: "Operation Status",
			placeholder: "Operation Status",
			inTable: true,
		},
		{
			type: "text",
			inputType: "text",
			name: "User.name",
			tableName: "User.name",
			label: "Name",
			placeholder: "Name",
			inTable: true,
		},
		{
			type: "text",
			inputType: "text",
			name: "User.email",
			tableName: "User.email",
			label: "Email",
			placeholder: "Email",
			inTable: true,
		},
		{
			type: "date",
			inputType: "date",
			name: "createdAt",
			tableName: "createdAt",
			label: "Done At",
			placeholder: "Done At",
			showTime: true,
			inTable: true,
		},
	],
};
