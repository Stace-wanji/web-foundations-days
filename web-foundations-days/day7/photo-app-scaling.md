# SnapShare Scaling Plan

## Assumptions & Back-of-the-Envelope Calculations

**Assumptions:**
- 10 million registered users.
- 10% of users are active each day.
- Each active user uploads 1 photo per day.
- Each active user views 50 feed pages per day.
- Average original photo size is 2 MB.
- Average thumbnail size is 50 KB (0.05 MB).
- A day has 86,400 seconds.

**Daily Active Users (DAU):**
- 10,000,000 users * 10% = **1,000,000 DAU**

**Uploads per Second:**
- 1,000,000 uploads / 86,400 seconds = **~12 uploads/second**

**Feed Views per Second:**
- 1,000,000 users * 50 views = 50,000,000 views/day
- Average: 50,000,000 / 86,400 = **~579 views/second**
- Peak (5x average): 579 * 5 = **~2,895 views/second**

**Photo Storage per Year:**
- Storage per photo = 2 MB (original) + 0.05 MB (thumbnail) = 2.05 MB
- Daily storage = 1,000,000 photos * 2.05 MB = 2,050,000 MB ≈ 2.05 TB/day
- Yearly storage = 2.05 TB * 365 days = **~748 TB/year** (approx. 750 TB/year)

## Read-Heavy vs. Write-Heavy

**Statement:** The system is heavily **read-heavy**. Users view 50 feed pages a day but only upload 1 photo a day, meaning read traffic (50M/day) is 50 times higher than write traffic (1M/day).

**What this means for the design:**
Because the system is read-heavy, the architecture must be optimized to serve reads as quickly and efficiently as possible. This dictates the use of aggressive caching (to store feed timelines and user sessions), Content Delivery Networks (to serve photo assets globally with low latency), and database read replicas (to offload read queries from the primary database). The write path can tolerate slightly higher latency since it is much less frequent.

## Photo Storage Strategy

**Why photos should not be stored inside the database:**
Relational databases are optimized for storing and querying structured, relatively small data (like text and numbers). Storing large binary files (blobs) like 2 MB photos directly in the database bloats the database size, makes backups extremely slow and expensive, degrades query performance, and limits overall scalability.

**Where they should go instead:**
Photos should be stored in **Object Storage** (such as AWS S3, Google Cloud Storage, or Azure Blob Storage). Object storage is specifically designed for storing large, unstructured binary files, offering virtually unlimited scalability, high durability, and cost-effectiveness. The database will only store the metadata and the URL/reference to the photo in object storage.

## Architecture Diagram

```text
       [ Users / Mobile Apps ]
                 |
                 v
      +--------------------+
      |        CDN         | <--- (Serves photos/thumbnails globally)
      +--------------------+
                 |
                 v
      +--------------------+
      |   Load Balancer    |
      +--------------------+
                 |
                 v
      +--------------------+
      |    App Servers     |
      +--------------------+
         |      |       |
         |      |       +---> [ Message Queue ] ---> [ Thumbnail Worker ]
         |      |                                            |
         |      +---> [ Cache (Redis) ]                      |
         |                                                   |
         +---> [ Primary Database ] <--- [ Read Replica ]    |
                 |                                           |
                 +-------------------------------------------+
                 |
                 v
      +--------------------+
      |  Object Storage    | 