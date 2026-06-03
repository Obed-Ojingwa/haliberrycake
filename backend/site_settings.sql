-- Create site_settings table for hero/about/images
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    image_url VARCHAR(500),
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial site settings for homepage/about sections
INSERT INTO site_settings (key, image_url, caption) VALUES
    ('hero_background', NULL, 'Main hero background image for homepage'),
    ('founder_portrait', NULL, 'Founder/Halimot portrait photo'),
    ('about_image_1', NULL, 'First about page image'),
    ('about_image_2', NULL, 'Second about page image')
ON CONFLICT (key) DO NOTHING;