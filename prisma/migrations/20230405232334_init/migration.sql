-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(100) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "other_name" VARCHAR(100),
    "title" VARCHAR(100),
    "bio" VARCHAR(255),
    "address" VARCHAR(255),
    "address_two" VARCHAR(255),
    "state" VARCHAR(100),
    "zip_code" VARCHAR(10),
    "country" VARCHAR(50),
    "country_code" VARCHAR(5),
    "admin_id" TEXT,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_id_key" ON "admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_phone_number_key" ON "admin"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "profile_id_key" ON "profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_admin_id_key" ON "profile"("admin_id");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
