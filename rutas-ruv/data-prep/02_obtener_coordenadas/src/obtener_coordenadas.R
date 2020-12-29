# Autora: Laura Junco
# Fecha: 02/10/2020
# R version 4.0.2

#cargar librerias
library(tidyverse) 
library(here)

#rutas de archivos
rutasdb <- here::here("02_obtener_coordenadas/input/frecuencia_rutas.csv")
coordenadasdb <- here::here("02_obtener_coordenadas/input/divipola.csv")
coordenadas_csv <- here::here("02_obtener_coordenadas/output/coordenadas.csv")

# cargar base de datos en dataframe
df <- read_csv(coordenadasdb) 
rutas_df <- read_csv(rutasdb) 

coordenadas_df <- df %>% 
    rename( cod_mpio = "Codigo Municipio",
            nom_mpio = "Nombre Municipio",
            lon = "Longitud",
            lat = "Latitud",
            tipo = "Tipo Centro Poblado"
    ) %>%
    filter(tipo == "CABECERA MUNICIPAL") %>%
    mutate(
        lon = round(lon, 3),
        lat = round(lat, 3)
        ) %>%
    select(cod_mpio, lon, lat) 
coordenadas_df

#convertir cod_mpio a number
coordenadas_df <-  coordenadas_df  %>% 
    mutate(cod_mpio = as.numeric(cod_mpio))

#pegar coordenadas salida
coordenadas_salida <- rutas_df %>% 
    inner_join(coordenadas_df, by = c('dane_salida' = 'cod_mpio')) %>%
    rename(
        lon_salida = lon,
        lat_salida = lat)

#pegar coordenadas entrada
coordenadas_completas <- coordenadas_salida %>% 
    inner_join(coordenadas_df, by = c('dane_llegada' = 'cod_mpio')) %>%
    rename(
        lon_llegada = lon,
        lat_llegada = lat
        )

 coordenadas_completas <- coordenadas_completas %>%
    select(
        mpio_salida,
        dane_salida,
        lon_salida,
        lat_salida,
        mpio_llegada,
        dane_llegada,
        lon_llegada,
        lat_llegada,
        total_recorridos
    )  
    
#exportar csv
coordenadas_completas %>% write_csv(coordenadas_csv)


