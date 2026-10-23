
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
const Browse = () =>{

    const appRouter = createBrowserRouter([

        {
         path: "/",
         element: <Hero />
        },
    ])

    return (

  <RouterProvider router={appRouter} /> 
    )
}

export default Browse;