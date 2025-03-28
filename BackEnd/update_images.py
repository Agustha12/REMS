import requests
import os
from database import engine
from sqlalchemy import text
import logging

# Set up logging with more detail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Sample image URLs from Unsplash with parameters for raw image download
IMAGE_URLS = {
    'apartment1.jpg': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'house1.jpg': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    'apartment2.jpg': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'villa1.jpg': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    'studio1.jpg': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'penthouse1.jpg': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    'duplex1.jpg': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'farmhouse1.jpg': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'apartment3.jpg': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'apartment4.jpg': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'house2.jpg': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    'villa2.jpg': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    'apartment5.jpg': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'farmhouse2.jpg': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
}

def download_image(url, filename):
    """Download an image from URL and save it to the images directory."""
    try:
        logger.info(f"Attempting to download {filename} from {url}")
        response = requests.get(url)
        response.raise_for_status()
        
        # Ensure the images directory exists
        images_dir = os.path.join(os.path.dirname(__file__), 'images')
        os.makedirs(images_dir, exist_ok=True)
        logger.info(f"Created/verified images directory at {images_dir}")
        
        # Save the image
        image_path = os.path.join(images_dir, filename)
        with open(image_path, 'wb') as f:
            f.write(response.content)
        logger.info(f"Successfully downloaded and saved {filename} to {image_path}")
        return True
    except Exception as e:
        logger.error(f"Error downloading {filename}: {str(e)}")
        return False

def update_database():
    """Update the database with image URLs."""
    try:
        with engine.connect() as connection:
            # First, check if the table exists and has data
            check_query = text("SELECT COUNT(*) as count FROM Property")
            result = connection.execute(check_query).fetchone()
            logger.info(f"Current number of properties in database: {result[0]}")
            
            # Update existing properties with image URLs
            update_query = text("""
                UPDATE Property
                SET ImageURL = 
                    CASE PropertyID
                        WHEN 1 THEN 'http://localhost:8000/images/apartment1.jpg'
                        WHEN 2 THEN 'http://localhost:8000/images/house1.jpg'
                        WHEN 3 THEN 'http://localhost:8000/images/apartment2.jpg'
                        WHEN 4 THEN 'http://localhost:8000/images/villa1.jpg'
                        WHEN 5 THEN 'http://localhost:8000/images/studio1.jpg'
                        WHEN 6 THEN 'http://localhost:8000/images/penthouse1.jpg'
                        WHEN 7 THEN 'http://localhost:8000/images/duplex1.jpg'
                        WHEN 8 THEN 'http://localhost:8000/images/farmhouse1.jpg'
                        WHEN 9 THEN 'http://localhost:8000/images/apartment3.jpg'
                        ELSE ImageURL
                    END
            """)
            result = connection.execute(update_query)
            logger.info(f"Updated {result.rowcount} existing properties with image URLs")
            
            # Insert new properties
            insert_query = text("""
                INSERT INTO Property (Type, Status, Rating, Size, LocationID, Cost, Features, ImageURL)
                VALUES
                ('Apartment', 'Available', 4.3, 1200, 1, 52000.0, '2 BHK, Balcony', 'http://localhost:8000/images/apartment4.jpg'),
                ('House', 'Available', 4.4, 2000, 2, 85000.0, '3 BHK, Garden', 'http://localhost:8000/images/house2.jpg'),
                ('Villa', 'Available', 4.7, 3500, 4, 125000.0, '4 BHK, Pool', 'http://localhost:8000/images/villa2.jpg'),
                ('Apartment', 'Available', 4.2, 1000, 3, 48000.0, '2 BHK', 'http://localhost:8000/images/apartment5.jpg'),
                ('Farmhouse', 'Available', 4.8, 5500, 8, 220000.0, '5 BHK, Farm', 'http://localhost:8000/images/farmhouse2.jpg')
            """)
            result = connection.execute(insert_query)
            logger.info(f"Inserted {result.rowcount} new properties")
            
            # Verify the updates
            verify_query = text("SELECT PropertyID, Type, ImageURL FROM Property")
            results = connection.execute(verify_query).fetchall()
            logger.info("Current property data:")
            for row in results:
                logger.info(f"Property {row[0]} ({row[1]}): {row[2]}")
            
        logger.info("Successfully updated database with image URLs and new properties")
    except Exception as e:
        logger.error(f"Error updating database: {str(e)}")
        raise  # Re-raise the exception to see the full traceback

def main():
    """Main function to download images and update database."""
    logger.info("Starting image download and database update process")
    
    # Download all images
    success_count = 0
    for filename, url in IMAGE_URLS.items():
        if download_image(url, filename):
            success_count += 1
    
    logger.info(f"Successfully downloaded {success_count} out of {len(IMAGE_URLS)} images")
    
    # Update database
    update_database()

if __name__ == "__main__":
    main() 