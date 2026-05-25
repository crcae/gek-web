-- CreateTable
CREATE TABLE "SlotImagen" (
    "id" TEXT NOT NULL,
    "seccion" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "url" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlotImagen_pkey" PRIMARY KEY ("id")
);
