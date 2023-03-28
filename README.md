# Roaming Genie
<br>

## Description

Welcome to Roaming Genie, an app that lets developers share their favorite workspaces outside of their homes! Whether it's a cozy coffee shop, a professional coworking space, or a peaceful library, Roaming Genie lets you discover new places to work and connect with other developers who share your tastes.

With Roaming Genie, you can browse the places other developers added to find workspaces that are conveniently located, and read reviews from other developers to get a sense of what each place is like. You can also add your own favorite workspaces, add workspaces to your favorites and leave comments and to help other developers find the best spots.

With Roaming Genie, you'll never have to work in the same place twice! Start exploring new workplaces today and connect with a community of developers who love to work on the go.

## User Stories

- **404:** As a user I get to see a 404 page with a feedback message if I try to reach a page that does not exist so that I know it's my fault.
- **Signup:** As an anonymous user I can sign up on the platform so that I can start creating and managing workplaces.
- **Login:** As a user I can login to the platform so that I can access my profile and start creating and managing workplaces.
- **Logout:** As a logged in user I can logout from the platform so no one else can use it.
- **All Workplaces Page:** As a logged in user I can see all the workplaces all the users have created.
- **Profile Page**: As a logged in user I can visit my profile page so that I can access the list of workplaces I have created and my favorited workplaces.
- **Add workplace Page:** As a logged in user I can access the add workplace page so that I can create a new workplace.
- **Edit workplace:** As a logged in user I can access the edit workplace page so that I can edit the workplace I created.
- **Workplace Details:** As a user I want to see the workplace details and comments.

<br>

# Client / Frontend

## React Router Routes (React App)

| Path                                  | Component              | Permissions                | Behavior                                                                                                                |
| ------------------------------------- | ---------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/login`                              | LoginPage              | anon only `<AnonRoute>`    | Login form, navigates to home page after login.                                                                         |
| `/signup`                             | SignupPage             | anon only `<AnonRoute>`    | Signup form, navigates to login page after signup.                                                                      |
| `/`                                   | HomePage               | public `<Route>`           | Home page.                                                                                                              |
| `/user-profile`                       | ProfilePage            | user only `<PrivateRoute>` | User profile displaying the user-created workplaces and user-favorited workplaces for the current user.                 |
| `/user-profile/edit`                  | EditProfilePage        | user only `<PrivateRoute>` | Edit user profile form.                                                                                                 |
| `/user-profile/favorites/:favoriteID` | DisplayFavoriteDetails | user only `<PrivateRoute>` | Access a favorite workplace.                                                                                            |
| `/user-profile/created/:createdID`    | DisplayFavoriteDetails | user only `<PrivateRoute>` | Access a favorite workplace.                                                                                            |
| `/workplace/add`                      | CreateWorkplacePage    | user only `<PrivateRoute>` | Create new workplace form.                                                                                              |
| `/workplaces`                         | WorkplacesListPage     | user only `<PrivateRoute>` | Workplaces added by all users with the possibility of filtering by city and type of place, and sorting by rating place. |
| `/workplace/:workplaceId`             | WorkplaceDetailPage    | user only `<PrivateRoute>` | Workplace details. Shows workplace details and comments.                                                                |

## Components

Pages:

- Login

- Signup

- Home

- Profile

- CreateWorkplace

- WorkplacesList

- WorkplaceDetails

Components:

- User
- WorkplaceCard
- Navbar

## Services



- **Workplace Service**

  - `workplaceService` :
    - `.createWorkplace(workplaceData)`
    - `.getWorkplace()`
    - `.getOneWorkplace(id)`
    - `.deleteWorkplace(id)`

<br>

# Server / Backend

## Models

**User model**

```javascript
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdWorkplaces: [ { type: Schema.Types.ObjectId, ref:'Workplace' } ],
  favoritedWorkplaces: [{type: Schema.Types.ObjectId, ref:'Workplace'}]
  comments: [{type: Schema.Types.ObjectId, ref:'Comment'}]
}
```

**Workplace model**

```javascript
 {
   name: { type: String, required: true },
   img: { type: String },
   rating: {type: Number, required: true},
   city: {type: String, required: true}
   description: {type: String},
   typeOfPlace: {["coffee shop", "cowork space", "library/bookstore" ], required: true},
   paid: {["yes", "no"]},
   description: {type: String},
   comment: [{type: Schema.Types.ObjectId, ref:'Comment'}]
 }, timestamps: true
```

**Comment model**

```javascript
{
  user: [{type: Schema.Types.ObjectId, ref:'User'}],
  workplace: [{type: Schema.Types.ObjectId, ref:'Workplace'}]
  comment: {type: String, required: true}
}
```

<br>

## API Endpoints (backend routes)

| HTTP Method | URL                                  | Request Body                                                                                | Success status | Error Status | Description                                                                                                                     |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------- | -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/auth/profile    `                  | Saved session                                                                               | 200            | 404          | Check if user is logged in and return profile page                                                                              |
| POST        | `/auth/signup`                       | {name, email, password}                                                                     | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                        | {username, password}                                                                        | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session              |
| POST        | `/auth/logout`                       |                                                                                             | 204            | 400          | Logs out the user                                                                                                               |
| GET         | `/api/workplaces`                    |                                                                                             |                | 400          | Show all workplaces                                                                                                             |
| GET         | `/api/workplace/:id`                 |                                                                                             |                |              | Show specific workplace                                                                                                         |
| POST        | `/api/create-workplaces`             | { name, img, rating, city, typeOfPlace, bookstore, paid, description, comment, timestamps } | 201            | 400          | Create and save a new workplace                                                                                                 |
| PUT         | `/api/edit-workplaces/:id`           | { name, img, rating, city, typeOfPlace, bookstore, paid, description, comment, timestamps } | 200            | 400          | edit workplace                                                                                                                  |
| DELETE      | `/api/workplaces/:id`                |                                                                                             | 201            | 400          | delete workplace                                                                                                                |
| PUT         | `/api/edit-user/:id`                 | { name, email, password }                                                                   | 201            | 400          | edit player                                                                                                                     |
| POST        | `/api/created-workplaces-list/:id`   | { name, img, rating, city, typeOfPlace, bookstore, paid, description, comment, timestamps } | 201            | 400          | Access user created workplaces list                                                                                             |
| POST        | `/api/create-favorite-workplace/:id` | { name, img, rating, city, typeOfPlace, bookstore, paid, description, comment, timestamps } | 201            | 400          | Create a new favorite workplace                                                                                                 |
| POST        | `/api/favorite-workplaces-list/:id`  | { name, img, rating, city, typeOfPlace, bookstore, paid, description, comment, timestamps } | 201            | 400          | Access user favorited workplaces list                                                                                           |

<br>

## API's

<br>

## Packages

<br>

## Links

### Trello/Kanban

[Link to your trello board](https://trello.com/b/PBqtkUFX/curasan) or a picture of your physical board

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/RafaelaUmbelino/Project_3_2023_Frontend)

[Server repository Link](https://github.com/RafaelaUmbelino/Project_3_2023_backend)

[Deployed App Link](https://roaming-genie.netlify.app/)

### Contributors

Rafaela Umbelino - <RafaelaUmbelino> - <https://www.linkedin.com/in/rafaela-umbelino/>

Gabriel Casagrande - <gbrlcsgn> - <https://www.linkedin.com/in/gabriel-casagrande-giacomin>
