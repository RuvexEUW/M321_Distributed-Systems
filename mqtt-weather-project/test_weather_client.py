import weather_client


def test_is_valid_temperature():
    # --- Arrange ---
    valid_temp = 22.5
    invalid_temp_low = -100     # lower than realistic
    invalid_temp_high = 200     # higher than realistic

    # --- Act ---
    result_valid = weather_client.is_valid_temperature(valid_temp)
    result_low = weather_client.is_valid_temperature(invalid_temp_low)
    result_high = weather_client.is_valid_temperature(invalid_temp_high)

    # --- Assert ---
    assert result_valid is True
    assert result_low is False
    assert result_high is False


def test_is_valid_humidity():
    # --- Arrange ---
    valid_humidity = 55
    low_humidity = -10
    high_humidity = 200

    # --- Act ---
    result_valid = weather_client.is_valid_humidity(valid_humidity)
    result_low = weather_client.is_valid_humidity(low_humidity)
    result_high = weather_client.is_valid_humidity(high_humidity)

    # --- Assert ---
    assert result_valid is True
    assert result_low is False
    assert result_high is False
