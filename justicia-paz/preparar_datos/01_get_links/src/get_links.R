# Autora: Laura Junco
# Fecha: 07/10/2020
# Exportar tablas csv con sources y targets para crear grafo en d3

#load libraries
library(tidyverse) 
library(here)

# paths
source("preparar_datos/01_get_links/src/functions.R")

bloques_db <- here::here("preparar_datos/01_get_links/input/bloques.csv")
juridicas_db <- here::here("preparar_datos/01_get_links/input/juridicas.csv")
naturales_db <- here::here("preparar_datos/01_get_links/input/naturales.csv")
postulados_db <- here::here("preparar_datos/01_get_links/input/postulados.csv")
csv_enlaces <- here::here("preparar_datos/01_get_links/output/links.csv")

#cargar df_bloques
bloques_df <- read_csv(bloques_db)
juridicas_df <- read_csv(juridicas_db)
naturales_df <- read_csv(naturales_db)
postulados_df <- read_csv(postulados_db)

# dataframe personas
enlaces_df <- data.frame(
                     sentencia=character(),
                     target=character(), 
                     value=integer(),
                     tipo=character()
              ) 
 
obtener_enlaces(bloques_df, "bloque", enlaces_df, csv_enlaces, TRUE)
obtener_enlaces(juridicas_df, "juridica", enlaces_df, csv_enlaces, FALSE)
obtener_enlaces(naturales_df, "natural", enlaces_df, csv_enlaces, FALSE)
obtener_enlaces(postulados_df, "postulado", enlaces_df, csv_enlaces, FALSE)

