-- BarberPro Schema

CREATE TABLE clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  codigo_referido TEXT UNIQUE NOT NULL,
  referido_por TEXT,
  puntos INTEGER DEFAULT 0,
  puntos_totales INTEGER DEFAULT 0,
  nivel TEXT DEFAULT 'bronce',
  racha INTEGER DEFAULT 0,
  descuento INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visitas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  fecha DATE DEFAULT CURRENT_DATE,
  puntos_ganados INTEGER DEFAULT 100,
  descuento_aplicado INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recompensas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  puntos_costo INTEGER NOT NULL,
  canjeada BOOLEAN DEFAULT FALSE,
  fecha_canje DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE VIEW clientes_con_stats AS
SELECT
  c.*,
  MAX(v.fecha) AS ultima_visita,
  COUNT(v.id) AS total_visitas,
  (CURRENT_DATE - MAX(v.fecha)) AS dias_sin_visita
FROM clientes c
LEFT JOIN visitas v ON c.id = v.cliente_id
GROUP BY c.id;
