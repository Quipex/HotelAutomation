# API Routes Specification

## Root Routes
- **Method**: GET
  - **URL**: `/`

## Dashboard Routes
- **Method**: GET
  - **URL**: `/dashboard`
  - **Query Parameters**: `date: string`

## Bookings Routes
- **Method**: POST
  - **URL**: `/bookings/`
- **Method**: GET
  - **URL**: `/bookings/cached`
- **Method**: GET
  - **URL**: `/bookings/arrive`
  - **Query Parameters**: `on: string`
- **Method**: GET
  - **URL**: `/bookings/added`
  - **Query Parameters**: `after: string`
- **Method**: GET
  - **URL**: `/bookings/id/:id`
- **Method**: GET
  - **URL**: `/bookings/not_paid`
  - **Query Parameters**: `arrive_after: string, expired?: boolean, wereReminded?: boolean`
- **Method**: PUT
  - **URL**: `/bookings/sync`
- **Method**: PUT
  - **URL**: `/bookings/confirm_prepayment`
  - **Body**: `{ bookingId: string }`
- **Method**: PUT
  - **URL**: `/bookings/confirm_living`
  - **Body**: `{ bookingId: string }`
- **Method**: PUT
  - **URL**: `/bookings/reminded_prepayment`
  - **Body**: `{ bookingId: string }`
- **Method**: PUT
  - **URL**: `/bookings/create`
  - **Body**: 
    ```json
    {
      "from": "Date",
      "to": "Date",
      "roomNumber": "string",
      "guestName": "string"
    }
    ```
- **Method**: PUT
  - **URL**: `/bookings/cancel`
  - **Body**: `{ bookingId: string }`
- **Method**: GET
  - **URL**: `/bookings/living_not_marked`
  - **Query Parameters**: `date: string`
- **Method**: PATCH
  - **URL**: `/bookings/note`
  - **Body**: `{ noteText: string, id: string }`
- **Method**: GET
  - **URL**: `/bookings/note`
  - **Query Parameters**: `id: string`
- **Method**: GET
  - **URL**: `/bookings/owner/id/:id`

## Clients Routes
- **Method**: POST
  - **URL**: `/clients/search`
  - **Body**: `{ name: string }`
- **Method**: GET
  - **URL**: `/clients/id/:id`
- **Method**: PATCH
  - **URL**: `/clients/note`
  - **Body**: `{ noteText: string, id: string }`
- **Method**: GET
  - **URL**: `/clients/note`
  - **Query Parameters**: `id: string`

## Notifications Routes
- **Method**: GET
  - **URL**: `/notifications/`
  - **Query Parameters**: `id_after: number`
- **Method**: GET
  - **URL**: `/notifications/unread`
- **Method**: PATCH
  - **URL**: `/notifications/read`
  - **Body**: `{ notificationId: number }`

## Rooms Routes
- **Method**: GET
  - **URL**: `/rooms/number/:number`
- **Method**: PATCH
  - **URL**: `/rooms/note`
  - **Body**: `{ noteText: string, roomNumber: string }`
- **Method**: GET
  - **URL**: `/rooms/note`
  - **Query Parameters**: `roomNumber: string`
