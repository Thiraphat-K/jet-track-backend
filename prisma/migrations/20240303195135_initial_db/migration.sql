-- CreateEnum
CREATE TYPE "roles" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "role" "roles" NOT NULL,
    "camera_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cameras" (
    "id" TEXT NOT NULL,
    "rtsp_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cameras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "camera_id" TEXT NOT NULL,
    "car_img_url" TEXT NOT NULL,
    "car_brand" TEXT NOT NULL,
    "lp_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_time" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license_plates" (
    "id" TEXT NOT NULL,
    "lp_number" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "lp_img_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "license_plates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_firstname_lastname_key" ON "users"("firstname", "lastname");

-- CreateIndex
CREATE UNIQUE INDEX "cameras_rtsp_url_key" ON "cameras"("rtsp_url");

-- CreateIndex
CREATE UNIQUE INDEX "cars_lp_id_date_time_key" ON "cars"("lp_id", "date_time");

-- CreateIndex
CREATE UNIQUE INDEX "license_plates_lp_number_key" ON "license_plates"("lp_number");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_camera_id_fkey" FOREIGN KEY ("camera_id") REFERENCES "cameras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_camera_id_fkey" FOREIGN KEY ("camera_id") REFERENCES "cameras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_lp_id_fkey" FOREIGN KEY ("lp_id") REFERENCES "license_plates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
