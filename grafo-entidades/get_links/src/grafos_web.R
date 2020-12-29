# Autora: Laura Junco
# Fecha: 01/07/2020
# Copyright: 202, CEV-SIM, GPL o más reciente
# Exportar tablas csv con sources y targets para crear grafo en d3

setwd("/Users/laura/Documents/CEV/gitlab/analisis-de-textos")

#load libraries
library(tidyverse) 
library(here)

# paths
inputdb <- here::here("entidades/get_links/input/df_vert_rel_par_exilio.csv.gz")
csvPersonas <- here::here("entidades/get_links/output/personas.csv")
csvLugares <- here::here("entidades/get_links/output/lugares.csv")

# load database into dataframe
df <- read_delim(inputdb, delim="|")

# dataframe personas
df_personas <- df %>% 
    select(texto.x, texto.y, etiqueta_entidades.x,
           etiqueta_entidades.y, entrevista, etiqueta_analitica) %>% 
    drop_na() %>% 
    filter(etiqueta_entidades.x == "Entidades - Personas",
           etiqueta_entidades.y == "Entidades - Personas") %>% 
    group_by(entrevista) %>% 
    count(texto.x, texto.y, etiqueta_analitica) %>% 
    ungroup() %>% 
    rename( source = texto.x, 
			target = texto.y,
      etiqueta = etiqueta_analitica)

# dataframe lugares
df_lugares <- df %>% 
    select(texto.x, texto.y, etiqueta_entidades.x,
           etiqueta_entidades.y, entrevista, etiqueta_analitica) %>% 
    drop_na() %>% 
    filter(etiqueta_entidades.x == "Entidades - Divipola", 
           etiqueta_entidades.y == "Entidades - Divipola") %>% 
    group_by(entrevista) %>% 
    count(texto.x, texto.y, etiqueta_analitica) %>% 
    ungroup() %>% 
    rename( source = texto.x, 
			target = texto.y, 
			etiqueta = etiqueta_analitica)

#write csv
df_personas %>% write_csv(csvPersonas)
df_lugares %>% write_csv(csvLugares)
