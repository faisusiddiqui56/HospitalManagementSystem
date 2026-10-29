# 1. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["Hospital Management System/Backend/AppointMentBooking/AppointMentBooking/AppointMentBooking.csproj", "AppointMentBooking/"]
RUN dotnet restore "AppointMentBooking/AppointMentBooking.csproj"

# Copy all source files and build
COPY . .
WORKDIR "/src/Hospital Management System/Backend/AppointMentBooking/AppointMentBooking"
RUN dotnet build "AppointMentBooking.csproj" -c Release -o /app/build

# 2. Publish Stage
FROM build AS publish
RUN dotnet publish "AppointMentBooking.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 3. Final Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "AppointMentBooking.dll"]

