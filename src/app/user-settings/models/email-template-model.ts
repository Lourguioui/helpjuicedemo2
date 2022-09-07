 const EmailTemplate = {
	title: "EmailTemplate",
	titleP: "Email Template",
	fields: [
		{
			type: "file",
			name: "images",
			inputType: "file",
			label: "Email Template Image",
			placeholder: "Upload",
			required: false,
			inTable: true,
		},
		{
			type: "text",
			name: "senderName",
			tableName: "senderName",
			inputType: "text",
			label: "Sender Name",
			placeholder: "Enter Name",
			required: true,
			inTable: true,
		},
		{
			type: "text",
			name: "senderEmail",
			tableName: "senderEmail",
			inputType: "text",
			label: "Sender Email",
			placeholder: "Enter Email",
			required: true,
			inTable: true,
		},
		{
			type: "html",
			inputType: "html",
			name: "header",
			tableName: "header",
			label: "Email Template Header",
			placeholder: "Email Template Header",
			required: true,
			inTable: true,

		},
		{
			type: "html",
			inputType: "html",
			name: "body",
			tableName: "body",
			label: "Email Template Body",
			placeholder: "Email Template Body",
			required: true,
			inTable: true,

		},
		{
		type: "html",
		inputType: "html",
		name: "footer",
		tableName: "footer",
		label: "Email Template Footer",
		placeholder: "Email Template Footer",
		required: true,
		inTable: true,
	},
	],
};

export { EmailTemplate };
