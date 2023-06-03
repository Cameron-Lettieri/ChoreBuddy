Chore Buddy

Chore Buddy is a chore-tracking application designed to help roommates manage and track their household chores efficiently. Users can create groups, assign and track chores, communicate through group chat, and receive chore-related reminders.

Features -
User Authentication: Users can create accounts or log in using their phone numbers to access Chore Buddy.
Group Management: Users can create or join groups to collaborate with their roommates.
Chore Assignment: Chores can be added, assigned randomly, and evenly rotated among group members to ensure fairness.
Group Chat: Users can communicate with other group members through the in-app group chat.
Chore Status and Completion Tracking: Users can mark chores as complete or in progress and view the status of each chore.
Reminder Notifications: Chore-related reminders can be sent to users via text messages to ensure the timely completion of tasks.
Technologies Used -
Frontend: React
Backend: Node.js and Express.js
Database: MySQL
Other Tools: IntelliJ IDEA, GitHub

User Authentication:

Allow users to register and log in using their phone numbers.
Implement authentication and authorization to ensure secure access to the application.

Group Creation and Management:

Enable users to create or join groups with their roommates.
Each group should have a unique identifier and access control to restrict communication and chore management to group members.

Group Chat:

Provide a chat feature within the group where users can communicate with each other.
Implement real-time messaging functionality using technologies like WebSocket to enable instant messaging between group members.

Chore Management:

Enable users to add, edit, and delete chores within the group.
Include fields for chore name, description, due date, and any additional relevant information.
Maintain a list of chores associated with the group.

Random Assignment of Chores:

Implement a mechanism to randomly assign chores to group members.
Ensure that each member gets assigned an equal number of chores over time.
Consider using a rotation method to evenly distribute the chores among roommates, preventing repetitive tasks.

Reminder Notifications:

Integrate a text messaging API to send reminders to roommates about pending chores.
Schedule and automate reminder notifications to be sent based on chore due dates.

User Profiles:

Allow users to manage their profile information within the application.
Include options for users to update their contact details, such as phone number or preferred notification settings.

Database Integration:

Use MySQL to store user information, group details, chat messages, and chore data.
Design and create appropriate database tables and relationships to support the application's functionality.

Responsive User Interface:

Develop a responsive and user-friendly interface using React, ensuring compatibility across various devices and screen sizes.
Design intuitive navigation and visually appealing components for an enhanced user experience.

Error Handling and Validation:

Implement proper error handling and validation to ensure data integrity and prevent unexpected behaviors.
Validate user inputs, such as chore names or due dates, to maintain data consistency.

This application was developed by Cameron Lettieri