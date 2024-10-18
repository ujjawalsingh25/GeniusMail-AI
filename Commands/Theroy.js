// __________________________________  Client Routes  _____________________________________________
// Page and 'Route' are reserved Keywords                                                          |
// page.tsx / page.jsx are used to create Client Route                                             |      
//               -->>  like http://localhost:3000/folder where folder is the Client Route          |
// route.tsx / route.jsx are used to create API Route                                              |
//               -->>  {"foo": "bar"} API inside the 'localhost:3000//folder' pager                |
//                                                                                                 |
// "[]"  -->>  Square brackets of folder name indicates the Routes this is dynamic Part of url     |
//           which is not hardcoded so inside the page.tsx of this folder we can access the url    |
// ________________________________________________________________________________________________|


// ___________________   Routes with auth folder  __________________________________________________________________
//                                                                                                                  |  
// if folders as -->> auth/login/page.tsx                                                                           |
// auth  -->> Needed 'auth' in the routes as localhost:3000/auth/register                                           |
//                                                                                                                  |
// if folders as -->> (auth)/login/page.tsx                                                                         |
// (auth)  -->> Won't needed the routes as localhost:3000/auth/register can directly use localhost:3000/register    |
// _________________________________________________________________                                                |
//                                                                                                                  |
// layout.tsx  -->> Renders the actual content -> {children}                                                        |
// _________________________________________________________________________________________________________________|


// ______________________________________________________________________________________________________________________
// "use client";                                                                                                         | 
//           -->>    // converts Server Component to Client Component                                                    |
// Any component created in app folder are consider 'Server Component' (by default)                                      |
//                                                                                                                       |
// Server Component                                                                                                      |
//   -->  Components that are rendered on the server and sent as static HTML to the client.                              |
//   -->  Suitable for components that don’t need interactivity or rely on browser-specific APIs.                        |
//   -->  Commonly used for static content or content that relies heavily on server-side data fetching.                  |
//                                                                                                                       |
// Client Component                                                                                                      |
//  -->  rendered on the client side, meaning they are shipped with JavaScript and executed in the user's browser.       |
//  -->  Suitable for components that need to manage state, respond to user interactions, or use browser-specific APIs.  |
//  -->  Commonly used for forms, buttons, modals, and other interactive elements.                                       |
// ______________________________________________________________________________________________________________________|



// ___________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________|_|
//                                                                                                                  | |
// ----------------   Hydration Error  -------------------                                                          | |
// -->> A hydration error in web development typically occurs when there is a mismatch                              | |
//        between the server-rendered HTML and the client-side JavaScript that attempts to "hydrate"                | |
//        or attach interactivity to that HTML in frameworks like React (and Next.js, which is built on React).     | |
// ______________________________________________________________________________________                           | |
//                                                                                                                  | |
//    ***  Cause  -->>  State Mismatch ***                                                                          | |
// (In Project) State Mismatch -->> Visible shift of Recommended list                                               | |
//  ___________________________________________                                                                     | |
// -->> If the server and client generate different HTML due to differing state or props,                           | |
//         React will notice the mismatch during hydration. This often happens if some state is                     | |
//         calculated differently on the server and client (e.g., a date or a random number).                       | |
// _______________________________________________________________________________________                          | |
//                                                                                                                  | |
//   ***** Solution / DEBUG  *****                                                                                  | |
// _____________________________________________                                                                    | |
// [1] -->> const isClient = useIsClient();                                                                         | |
//          --> to check if clientSideRendering or ServerSide Rendering                                             | |
// _____________________________________________________                                                            | |
//    const isClient = useIsClient();                   |                                                           | | 
//                                                      |                                                           | |
// -->>    if(!isClient) {//execute this}               |                                                           | |
// -->>    else {//execute this ...}                    |                                                           | |
// _____________________________________________________|                                                           | |
//                                                                                                                  | |
//                                                                                                                  | |
// [2] -->>  Use Hooks (useEffect and useState) -->> both are for ServerSide Rendering                              | |
//          --> When server in on ServerSide Rendering only then it will access useEffect and useState              | |
//                  so while running in ServerSide (like Reloading) we can Renders our Skeletons                    | |
//                  and once state change based on dependencies "useEffect" will                                    | |
//                  hence using useState we can set variable isClient -> true                                       | |
//                  and render Client-Side Javascript.    (Code Below)                                              | |
// _____________________________________________________                                                            | |
// const [isClient, setIsClient] = useState(false);     |                                                           | |                       
// useEffect(() => {                                    |                                                           | |
//     setIsClient(true);                               |                                                           | | 
// }, []);                                              |                                                           | |
//                                                      |                                                           | |
// -->>    if(!isClient) {//execute this}               |                                                           | |
// -->>    else {//execute this ...}                    |                                                           | |
// _____________________________________________________|___________________________________________________________|_|
// _____________________________________________________|___________________________________________________________|_|
