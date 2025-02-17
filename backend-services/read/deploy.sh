# #!/bin/bash

# # Set your project ID
# PROJECT_ID="border-than-u"

# # Set the App Engine service name
# SERVICE_NAME="read"

# # Fetch the latest version of the APP_SEARCH_API_KEY secret
# APP_SEARCH_API_KEY=$(gcloud secrets versions access latest --secret=APP_SEARCH_API_KEY --project=$PROJECT_ID)

# # Update the env_variables.yaml file
# echo "env_variables:" > env_variables.yaml
# echo "  APP_SEARCH_API_KEY: \"$APP_SEARCH_API_KEY\"" >> env_variables.yaml

# # Deploy to App Engine
# gcloud app deploy app.yaml --project=$PROJECT_ID --version=v1 --quiet


# deploy.sh
#!/bin/bash

# Set your project ID
PROJECT_ID="border-than-u"

# Set the App Engine service name
SERVICE_NAME="read"

# Fetch all necessary secrets
APP_SEARCH_API_KEY=$(gcloud secrets versions access latest --secret=APP_SEARCH_API_KEY --project=$PROJECT_ID)
APP_SEARCH_BASE_URL=$(gcloud secrets versions access latest --secret=APP_SEARCH_BASE_URL --project=$PROJECT_ID)
ENGINE_NAME=$(gcloud secrets versions access latest --secret=ENGINE_NAME --project=$PROJECT_ID)

# Update the env_variables.yaml file
echo "env_variables:" > env_variables.yaml
echo "  APP_SEARCH_API_KEY: \"$APP_SEARCH_API_KEY\"" >> env_variables.yaml
echo "  APP_SEARCH_BASE_URL: \"$APP_SEARCH_BASE_URL\"" >> env_variables.yaml
echo "  ENGINE_NAME: \"$ENGINE_NAME\"" >> env_variables.yaml

# Deploy to App Engine
gcloud app deploy app.yaml --project=$PROJECT_ID --version=v1 --quiet