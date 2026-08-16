import os
import glob
from moviepy import VideoFileClip

media_dir = r"C:\Users\gmeov\.gemini\antigravity\scratch\driving_exam_app\media"
wmv_files = glob.glob(os.path.join(media_dir, "*.wmv"))

for wmv in wmv_files:
    mp4_file = wmv.rsplit(".", 1)[0] + ".mp4"
    if not os.path.exists(mp4_file):
        print(f"Converting {wmv} to {mp4_file}...")
        try:
            clip = VideoFileClip(wmv)
            clip.write_videofile(mp4_file, codec="libx264", audio_codec="aac", logger=None)
            clip.close()
            print(f"Success: {mp4_file}")
        except Exception as e:
            print(f"Failed to convert {wmv}: {e}")

print("Done converting.")
