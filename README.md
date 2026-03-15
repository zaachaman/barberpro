# BarberPro 💈

Sistema de fidelización para barberías con puntos, niveles, recompensas y emails automáticos.

## Stack
- **Frontend**: Next.js 14 (App Router)
- **Base de datos**: Supabase (PostgreSQL)
- **Emails**: Resend
- **Deploy**: Vercel + GitHub

## Setup

1. Instalar dependencias
   npm install

2. Configurar variables de entorno
   cp .env.local.example .env.local
   # Edita con tus claves de Supabase y Resend

3. Crear tablas en Supabase
   # Corre supabase/schema.sql en el SQL Editor de Supabase

4. Correr en desarrollo
   npm run dev

## Recompensas
- 500 pts  → 10% descuento
- 1,000 pts → 1 corte gratis
- 2,000 pts → 20% descuento permanente

## Niveles
- Bronce:  0 – 499 pts
- Plata:   500 – 999 pts
- Oro:     1,000 – 1,999 pts
- Platino: 2,000+ pts
