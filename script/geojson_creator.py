#%%
# IMPORT PACKAGES####
import geopandas as gpd 
import pandas as pd
import os 
import datetime

# Change Working Directory====
os.chdir(os.path.dirname(__file__))
print(os.getcwd())

# DEFINE A CLASS####
class GeoJSONCreator:
    def __init__(self):
        self.geojson = {
            "name": [],
            "year_start": [],
            "year_end": [],
            "description": [],
            "geometry": []
            }
        
    def add(self, loc_name, year_start, year_end, description, fix = False):
        # Get index by to delete record====
        ys = datetime.datetime.strptime(year_start, "%Y-%m-%d").date()
        ye = "present" if year_end == "present" else datetime.datetime.strptime(year_end, "%Y-%m-%d").date()
        if fix:
            idx = self.geojson["name"].index(loc_name)
            self.geojson["name"][idx] = loc_name
            self.geojson["year_start"][idx] = ys
            self.geojson["year_end"][idx] = ye
            self.geojson["description"][idx] = description 
        else:
            self.geojson["name"].append(loc_name)
            self.geojson["year_start"].append(ys)
            self.geojson["year_end"].append(ye) 
            self.geojson["description"].append(description)

        self.geojson["geometry"] = None
        
    # Get Geometry from Address====
    def get_geom(self):
        srs = self.geojson["name"]
        geom_list = gpd.tools.geocode(srs)["geometry"].to_list()
        self.geojson["geometry"] = geom_list

    # Chronologically Order the Points and Export as GeoJSON====
    def export(self, filename = "../data/file.geojson"):
        gdf = gpd.GeoDataFrame(self.geojson, crs = 4326)
        # get only date and store as str?
        gdf = gdf.sort_values(by = "year_start", ascending = True).reset_index(drop = True).to_file(filename)


# %%
gjson = GeoJSONCreator()
gjson.add("Nagoya, Aichi", "2000-02-11", "2000-02-11", "I was born in Nagoya where my grandparents live/ lived.")
gjson.add("Yokohama, Kanagawa", "2000-02-12", "present", "Soon after I was born, I moved to Yokohama, where I took most of my education. I am still living in this city now too.")
gjson.add("Sagamihara Campus, Aoyama Gakuin University, Sagamihara city", "2018-04-01", "2022-03-31", "I went to School of Global Studies and Collaboration. I took courses about social science, especially about international development and Southeast Asian studies")
gjson.add("Thammasat University, Bangkok", "2019-08-06", "2019-12-19", "I studied economics, politics, and culture of ASEAN countries and Chinese countries at International Studies, ASEAN China Program. I was a backpacker too and traveled regions with my friends/ by myself.")
gjson.add("University of Philippines, Los Baños", "2020-02-01", "2020-03-14", "I taught garbage issues to kindergarten students in a remote area, in collaboration with AIESEC in UPLB. I spent 6weeks to lead the education programs as well as a fundraising program.")
gjson.add("Clark University, Massachusetts", "2022-08-29", "2024-05-20", "I studied Geographic Information Science specifically for conservation applications. I participated in and eventually led several analytical projects using GIS data and remote sensed data.")
gjson.add("Shinjuku, Tokyo", "2024-07-01", "present", "I am currently working for a consutancy firm and have been involved in several projects. I developed a web mapping application using cloud native geospatial datasets and organized an education program about forestry GIS application in Papua New Guinea.")
gjson.get_geom()
gjson.export()
# %%
