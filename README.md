# RemindersApp_server

## Server-side code for the Reminders App code test from ubiquity. Built using Node, Express and Typescript

### `Running a local copy of the code`

Clone and navigate in to the directory.

Run the following script:
$ npm i
$ npm run dev

The application will start on `http://localhost:8000`.

Remember to clone and start the client side part of the application aswell.
Found here: https://github.com/MaximilianLartell/RemindersApp_client

### Trying out the hosted verision on Netlify.

If using for the first time the sign-in/sign-up might take a while since the server need to start at heroku.
If not signed in/up immediately pls wait for about 15 seconds and try again.

Create your own user or sign in with:
username: User,
password: Password

NOTE! If you sign up with your own user, note that the password for time being is stored unencrypted in the database.

https://max-reminder-client.netlify.app

### Implemented user stories.

I as a user can create to-do items, such as a grocery list.

I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on things that are still pending.

I as a user can be sure that my todos will be persisted so that important information is not lost when server restarts.

I as a user can create multiple to-do lists where each list has it's unique URL that I can share with my friends - so that I could have separate to do lists for my groceries and work related tasks.

I as a user can filter the to-do list and view items that were marked as done - so that I can retrospect on my prior progress.

​I as ​another user ​can collaborate in real-time with ​user ​- so that we can (for example) edit our family shopping-list together.
