#!/bin/bash
# Feature generator by @cacing69

# Ambil input pertama dari argumen
input_case="$1"

# Ubah menjadi array dengan delimiter '-'
IFS='-' read -ra parts <<< "$input_case"

# 1. RolePermission (PascalCase)
pascal_case=""
for word in "${parts[@]}"; do
  pascal_case+=$(echo "${word:0:1}" | tr '[:lower:]' '[:upper:]')
  pascal_case+="${word:1}"
done

# 2. role_permission (snake_case)
snake_case=$(echo "$input_case" | tr '-' '_')

# 3. rolePermission (camelCase)
camel_case="${parts[0]}"
for ((i = 1; i < ${#parts[@]}; i++)); do
  camel_case+=$(echo "${parts[i]:0:1}" | tr '[:lower:]' '[:upper:]')
  camel_case+="${parts[i]:1}"
done

# 4. Role Permission (Normal Title Case)
normal_case=""
for word in "${parts[@]}"; do
  normal_case+=$(echo "${word:0:1}" | tr '[:lower:]' '[:upper:]')
  normal_case+="${word:1} "
done

# Trim trailing space
normal_case=$(echo "$normal_case" | sed 's/ *$//')

# Create with argument name on /src/features
dir_feature="$(pwd)/src/features/"
dir_stubs="$(pwd)/stubs/feature"
dir_target="$dir_feature$input_case"

echo "Creating feature : $normal_case";

if [ -d "$dir_target" ]; then
  echo -e "Feature [$input_case] already exists."
  exit 1
fi

# Buat direktori tujuan jika belum ada
mkdir -p "$dir_target"

# copy isi stubs ke module baru
echo "----------------------------------------------------"
yes | cp -rf "$dir_stubs/"* "$dir_target"

# Creating controller
stub_controller="$dir_target/infrastructures/http/controllers/controller.stub"
feat_controller="$dir_target/infrastructures/http/controllers/${input_case}.controller.ts"

if [ -f "$stub_controller" ]; then
  mv "$stub_controller" "$feat_controller"
  echo "Copying controller.stub to ${input_case}.controller.ts"
else
  echo "Error: File controller.stub not found at $stub_controller"

  # Delete Feat Directory
  rm -rf "$dir_target"

  exit 1
fi

# Replace content page
awk -v replacement="$pascal_case" '{gsub(/\{PASCAL_NAME\}/, replacement); print}' "$feat_controller" > temp_file && mv temp_file "$feat_controller"
awk -v replacement="$normal" '{gsub(/\{NORMAL_NAME\}/, replacement); print}' "$feat_controller" > temp_file && mv temp_file "$feat_controller"

# Creating route
stub_router="$dir_target/infrastructures/http/router.stub"
feat_router="$dir_target/infrastructures/http/${input_case}.router.ts"
if [ -f "$stub_router" ]; then
  mv "$stub_router" "$feat_router"
  echo "Copying router.stub to ${input_case}.router.ts"
else
  echo "Error: File router.stub not found at $old_route_path"

  # Delete Feat Directory
  rm -rf "$dir_target"

  exit 1
fi

# Replace content route
awk -v replacement="$pascal_case" '{gsub(/\{PASCAL_NAME\}/, replacement); print}' "$feat_router" > temp_file && mv temp_file "$feat_router"
awk -v replacement="$input_case" '{gsub(/\{FEATURE_NAME\}/, replacement); print}' "$feat_router" > temp_file && mv temp_file "$feat_router"
awk -v replacement="$normal_case" '{gsub(/\{NORMAL_NAME\}/, replacement); print}' "$feat_router" > temp_file && mv temp_file "$feat_router"
awk -v replacement="$camel_case" '{gsub(/\{CAMEL_NAME\}/, replacement); print}' "$feat_router" > temp_file && mv temp_file "$feat_router"

# Creating response
stub_response="$dir_target/infrastructures/http/responses/response.stub"
feat_response="$dir_target/infrastructures/http/responses/paginate-${input_case}.response.ts"
if [ -f "$stub_response" ]; then
  mv "$stub_response" "$feat_response"
  echo "Copying response.stub to responses/${input_case}.response.ts"
else
  echo "Error: File response.stub not found at $feat_response"

  # Delete Feat Directory
  rm -rf "$dir_target"

  exit 1
fi

# Replace content response
awk -v replacement="$pascal_case" '{gsub(/\{PASCAL_NAME\}/, replacement); print}' "$feat_response" > temp_file && mv temp_file "$feat_response"

exit 0