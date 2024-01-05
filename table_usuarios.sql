CREATE TABLE usuarios(
    id SERIAL NOT NULL,
    rut character varying(20) NOT NULL,
    nombre character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    balance double precision NOT NULL DEFAULT '100000'::double precision,
    createdat timestamp with time zone NOT NULL,
    updatedat timestamp with time zone NOT NULL,
    
    PRIMARY KEY(id)
);