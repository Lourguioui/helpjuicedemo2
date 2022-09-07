export default {
    name: "RateManagement",
    title: "Rate Management",
    titleP: "Rate Management",
    url: "/rates",
    fields: [
        {
            tableName: "name",
            label: "Name",
            inTable: true,
        },
        {
            tableName: "minimumTickets",
            label: "Minimum ticket number",
            inTable: true
        },
        {
            tableName: "percentage",
            label: "ACTION (Discount / Increase)",
            inTable: true
        },
        {
            tableName: "active",
            label: "Active",
            inTable: true,
        },
    ],
};
