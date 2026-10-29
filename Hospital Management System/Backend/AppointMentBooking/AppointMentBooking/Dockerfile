# 1. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["AppointMentBooking.csproj", "./"]
RUN dotnet restore "AppointMentBooking.csproj"
COPY . .
RUN dotnet build "AppointMentBooking.csproj" -c Release -o /app/build

# 2. Publish Stage
FROM build AS publish
RUN dotnet publish "AppointMentBooking.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 3. Final Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "AppointMentBooking.dll"]
