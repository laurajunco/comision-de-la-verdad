# Autora: Laura Junco
# Fecha: 02/10/2020
# R version 4.0.2

#cargar librerias
library(tidyverse) 
library(here)

#rutas de archivos
inputdb <- here::here("01_frecuencia_rutas/input/rutas.csv")
rutas_frecuencia_csv <- here::here("01_frecuencia_rutas/output/frecuencia_rutas.csv")

# cargar base de datos en dataframe
df <- read_csv(inputdb)


# Agrupar por año
rutas_agrupadas_df <- df %>%
  filter(anio > "1984") %>%
  group_by(recorrido) %>%
  summarise(total_recorridos=sum(total)) %>%
  arrange(desc(total_recorridos))

#partir recorrido en columnas
rutas_frecuencia_df <- rutas_agrupadas_df %>%
  separate(recorrido, c("depto_salida", "mpio_salida", "dane_salida", "depto_llegada", "mpio_llegada", "dane_llegada" ), "_") %>%
  filter(dane_salida != dane_llegada)

#exportar csv
rutas_frecuencia_df %>% write_csv(rutas_frecuencia_csv)
