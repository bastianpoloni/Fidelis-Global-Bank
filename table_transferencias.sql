CREATE TABLE transferencias(
    id SERIAL NOT NULL,
    emisor integer,
    receptor integer,
    monto double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT transferencias_emisor_fkey FOREIGN key(emisor) REFERENCES usuarios(id),CONSTRAINT transferencias_receptor_fkey FOREIGN key(receptor) REFERENCES usuarios(id)
);