require "test_helper"

class DexcomClientTest < ActiveSupport::TestCase
  test "formats query timestamps as utc without timezone suffix" do
    client = Dexcom::Client.new
    time = Time.zone.parse("2026-03-19 16:05:42 +01:00")

    formatted = client.send(:iso8601_time, time)

    assert_equal "2026-03-19T15:05:42", formatted
  end
end
