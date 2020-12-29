#!/usr/bin/env Rscript --vanilla
###############################################################################
# Autor: Laura Junco
# Contribuyentes: 
# Fecha: 02 octubre 2020
# Version de R: 4.0.2
###############################################################################

.PHONY: all frecuencia_rutas clean

all: frecuencia_rutas

clean:
	@echo "borrando archivos"
	rm output/*

frecuencia_rutas: \
	src/frecuencia_rutas.R \
	input/rutas.csv
	Rscript --vanilla $<

