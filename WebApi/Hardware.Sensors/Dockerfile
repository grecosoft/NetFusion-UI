FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /build/src

# --------------------------------------
# RESTORE
# --------------------------------------

# Copy microservice components:
COPY ./src/Components/Hardware.Sensors.App/*.csproj ./Components/Hardware.Sensors.App/
COPY ./src/Components/Hardware.Sensors.Domain/*.csproj ./Components/Hardware.Sensors.Domain/
COPY ./src/Components/Hardware.Sensors.Infra/*.csproj ./Components/Hardware.Sensors.Infra/

# Copy microservice hosts:
COPY ./src/Hardware.Sensors.Tests/*.csproj ./Hardware.Sensors.Tests/
COPY ./src/Hardware.Sensors.WebApi/*.csproj ./Hardware.Sensors.WebApi/

# Copy the solution file to restore all projects:
COPY ./Hardware.Sensors.sln /build
RUN dotnet restore /build

# --------------------------------------
# BUILD / TEST / PUBLISH
# --------------------------------------

# Copy all of the source to be built:
COPY ./src ./
RUN dotnet build /build 
RUN dotnet test ./Hardware.Sensors.Tests/ --no-build
RUN dotnet publish ./Hardware.Sensors.WebApi/Hardware.Sensors.WebApi.csproj --output ../out --no-build

# --------------------------------------
# CREATE IMAGE FOR CONTAINER CREATION
# --------------------------------------
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1	
WORKDIR /microservice

COPY --from=build-env /build/out ./
ENTRYPOINT ["dotnet", "Hardware.Sensors.WebApi.dll"]
EXPOSE 80
