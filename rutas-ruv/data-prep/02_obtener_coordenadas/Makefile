#!/usr/bin/env Rscript --vanilla
###############################################################################
# Autor: Laura Junco
# Contribuyentes: 
# Fecha: 02 octubre 2020
# Version de R: 4.0.2
###############################################################################

.PHONY: all obtener_coordenadas clean

all: obtener_coordenadas

clean:
	@echo "borrando archivos"
	rm output/*

obtener_coordenadas: \
	src/obtener_coordenadas.R \
	input/frecuencia_rutas.csv \
	input/divipola.csv
	Rscript --vanilla $<

