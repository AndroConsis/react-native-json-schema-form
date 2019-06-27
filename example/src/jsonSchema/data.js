module.exports = {
    schema: {
        title: "",
        description: "",
        type: "object",
        properties: {
            "Personal": {
                title: "A registration form",
                description: "A simple form example.",
                type: "object",
                properties: {
                    firstName: {
                        type: "string",
                        title: "First name"
                    },
                    lastName: {
                        type: "string",
                        title: "Last name",
                    },
                    age: {
                        type: "integer",
                        title: "Age",
                    },
                    bio: {
                        type: "string",
                        title: "Bio",
                    },
                },
            }
        }
    },
    uiSchema: {
        "ui:order": ["Personal"],
        "Personal": {
            "ui:order": ["firstName", "lastName", "age", "bio"],
            firstName: {
                "ui:widget": "text"
            },
            lastName: {
                "ui:widget": "text"
            },
            age: {
                "ui:widget": "text"
            },
            bio: {
                "ui:widget": "text",
            },
        }
    },
    formData: {},
};