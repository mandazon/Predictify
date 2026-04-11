import os

images_dir = r"C:\Users\TOSHIBA\Desktop\Predictify\3-Backend\1-Python\predictify\media\images"
for filename in os.listdir(images_dir):
    if '_' in filename and filename.endswith('.png'):
        base_name = filename.split('_')[0] + '.png'
        if base_name in os.listdir(images_dir):
            print(f"Ignoré : {base_name} existe déjà, suppression de {filename}")
            os.remove(os.path.join(images_dir, filename))
            continue
        os.rename(
            os.path.join(images_dir, filename),
            os.path.join(images_dir, base_name)
        )
        print(f"Renommé {filename} en {base_name}")