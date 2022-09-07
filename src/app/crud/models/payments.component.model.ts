export default {
	name: "Payment",
	generic: true,
	title: "Payment",
	titleP: "Payments",
	url: "/payments",
	disableCreate: true,
	disableEdit: true,
	disableDelete: true,
	fields: [
		{
			tableName: "id",
			label: "ID",
			inTable: true,
		},
		{
			tableName: "Customer.name",
			label: "Customer",
			inTable: true,
		},
		{
			tableName: "Customer.phone",
			label: "Customer Phone",
			inTable: true,
		},
		{
			tableName: "amount",
			label: "Amount",
			inTable: true,
			format: "currency",
		},
		{
			tableName: "method",
			label: "Method",
			inTable: true,
		},
		{
			tableName: "status",
			label: "Status",
			inTable: true,
		},
		{
			tableName: "description",
			label: "Description",
			inTable: true,
		},
		{
			type: "date",
			tableName: "createdAt",
			label: "Date",
			showTime: true,
			inTable: true,
		},
	],
};
