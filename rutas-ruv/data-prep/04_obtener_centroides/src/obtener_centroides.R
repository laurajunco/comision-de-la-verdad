# Autora: Laura Junco
# Fecha: 02/10/2020
# R version 4.0.2

#cargar librerias
library(tidyverse) 
library(here)

#rutas de archivos
mpiosdb <- here::here("04_obtener_centroides/input/municipios_flujos.csv")
coordenadasdb <- here::here("04_obtener_centroides/input/divipola.csv")
centroides_csv <- here::here("04_obtener_centroides/output/mpios_llegada_salida.csv")
centroides_anio_csv <- here::here("04_obtener_centroides/output/mpios_llegada_salida_anio.csv")

# cargar base de datos en dataframe
df <- read_csv(coordenadasdb)  #divipola
mpios_df <- read_csv(mpiosdb) 

#Filtrar columnas tabla divipola
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
centroides_mpio <- mpios_df %>% 
    inner_join(coordenadas_df, by = c('codmpio' = 'cod_mpio')) %>%
    rename(
        lon = lon,
        lat = lat)

#seleccionar columnas necesarias
centroides_mpio <- centroides_mpio %>%
    select(
       dpto,
       mpio,
       codmpio,
       anio,
       salida,
       llegada,
       lon,
       lat
    )  

#agrupar por anio
centroides_mpio_anio <- centroides_mpio %>%
    group_by(mpio) %>%
    summarise(  
                dpto=dpto,
                lon=lon,
                lat=lat,
                salida=sum(salida),
                llegada=sum(llegada),
                total= sum(salida+llegada)
            )

centroides_mpio_anio <- unique(centroides_mpio_anio )


#exportar csv
centroides_mpio_anio %>% write_csv(centroides_anio_csv)
centroides_mpio %>% write_csv(centroides_csv)

#Listo!