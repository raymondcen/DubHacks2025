import os
import subprocess
import imageio_ffmpeg as ffmpeg

# Set project root
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Input and output directories
input_dir = os.path.join(project_root, "dataset")
output_dir = os.path.join(project_root, "dataset_frames")

# Frames per second to extract
fps = 5

# Ensure output_dir exists
os.makedirs(output_dir, exist_ok=True)

# Path to ffmpeg executable provided by imageio-ffmpeg
ffmpeg_exe = ffmpeg.get_ffmpeg_exe()

# Loop over label folders
for label in os.listdir(input_dir):
    label_path = os.path.join(input_dir, label)
    if not os.path.isdir(label_path):
        continue

    output_label_path = os.path.join(output_dir, label)
    os.makedirs(output_label_path, exist_ok=True)

    # Loop over video clips in each label
    clip_count = 1
    for clip_file in os.listdir(label_path):
        clip_path = os.path.join(label_path, clip_file)
        if not os.path.isfile(clip_path):
            continue

        # Output folder named clip1, clip2, etc.
        clip_output_path = os.path.join(output_label_path, f"clip{clip_count}")
        os.makedirs(clip_output_path, exist_ok=True)

        # Build ffmpeg command
        cmd = [
            ffmpeg_exe,
            '-i', clip_path,
            '-vf', f'fps={fps}',
            os.path.join(clip_output_path, 'frame_%03d.jpg')
        ]

        print(f"Extracting frames from {clip_path} to {clip_output_path} ...")
        subprocess.run(cmd, check=True)

        clip_count += 1

print("Frame extraction complete!")
