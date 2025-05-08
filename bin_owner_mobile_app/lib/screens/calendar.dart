import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:bin_owner_mobile_app/theme/colors.dart';

class CollectionCalendarScreen extends StatefulWidget {
  const CollectionCalendarScreen({super.key});

  @override
  State<CollectionCalendarScreen> createState() =>
      _CollectionCalendarScreenState();
}

class _CollectionCalendarScreenState extends State<CollectionCalendarScreen> {
  late DateTime _focusedDay;
  late DateTime _selectedDay;
  late CalendarFormat _calendarFormat;
  final Map<DateTime, List<CollectionEvent>> _events = {};

  @override
  void initState() {
    super.initState();
    _focusedDay = DateTime.now();
    _selectedDay = _focusedDay;
    _calendarFormat = CalendarFormat.month;
    _loadEvents();
  }

  void _loadEvents() {
    // Sample data - replace with your actual data
    final now = DateTime.now();
    _events[now] = [
      CollectionEvent(
        type: 'Recyclables',
        time: '09:00 AM',
        bins: ['Bin A', 'Bin C'],
      ),
    ];
    _events[now.add(const Duration(days: 2))] = [
      CollectionEvent(type: 'Organic', time: '10:30 AM', bins: ['Bin B']),
    ];
    _events[now.add(const Duration(days: 7))] = [
      CollectionEvent(
        type: 'General Waste',
        time: '08:00 AM',
        bins: ['Bin D', 'Bin E'],
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Collection Calendar'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _scheduleNewCollection,
            tooltip: 'Schedule Collection',
          ),
        ],
      ),
      body: Column(
        children: [
          TableCalendar(
            firstDay: DateTime.utc(2020, 1, 1),
            lastDay: DateTime.utc(2030, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            calendarFormat: _calendarFormat,
            eventLoader: (day) => _events[day] ?? [],
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            },
            onFormatChanged: (format) {
              setState(() => _calendarFormat = format);
            },
            onPageChanged: (focusedDay) => _focusedDay = focusedDay,
            calendarStyle: CalendarStyle(
              selectedDecoration: BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              todayDecoration: BoxDecoration(
                color: Colors.grey[800],
                shape: BoxShape.circle,
              ),
              markerDecoration: BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              outsideDaysVisible: false,
            ),
            headerStyle: HeaderStyle(
              formatButtonVisible: true,
              titleCentered: true,
              formatButtonDecoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              formatButtonTextStyle: const TextStyle(color: Colors.white),
              leftChevronIcon: Icon(Icons.chevron_left, color: Colors.white),
              rightChevronIcon: Icon(Icons.chevron_right, color: Colors.white),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(child: _buildEventList()),
        ],
      ),
    );
  }

  Widget _buildEventList() {
    final events = _events[_selectedDay] ?? [];

    if (events.isEmpty) {
      return Center(
        child: Text(
          'No collections scheduled',
          style: TextStyle(color: Colors.grey[600]),
        ),
      );
    }

    return ListView.builder(
      itemCount: events.length,
      itemBuilder: (context, index) {
        final event = events[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          color: Colors.grey[850],
          child: ListTile(
            leading: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: _getEventColor(event.type),
                shape: BoxShape.circle,
              ),
              child: Icon(_getEventIcon(event.type), color: Colors.white),
            ),
            title: Text(
              event.type,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Time: ${event.time}'),
                Text('Bins: ${event.bins.join(', ')}'),
              ],
            ),
            trailing: IconButton(
              icon: const Icon(Icons.delete, color: Colors.red),
              onPressed: () => _removeEvent(event),
            ),
          ),
        );
      },
    );
  }

  Color _getEventColor(String type) {
    switch (type.toLowerCase()) {
      case 'recyclables':
        return Colors.blue;
      case 'organic':
        return Colors.green;
      case 'general waste':
        return Colors.grey;
      default:
        return AppColors.primary;
    }
  }

  IconData _getEventIcon(String type) {
    switch (type.toLowerCase()) {
      case 'recyclables':
        return Icons.recycling;
      case 'organic':
        return Icons.eco;
      case 'general waste':
        return Icons.delete;
      default:
        return Icons.calendar_today;
    }
  }

  void _scheduleNewCollection() {
    // TODO: Implement collection scheduling
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Schedule New Collection'),
            content: const Text('Feature coming soon!'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('OK'),
              ),
            ],
          ),
    );
  }

  void _removeEvent(CollectionEvent event) {
    setState(() {
      _events[_selectedDay]?.remove(event);
      if (_events[_selectedDay]?.isEmpty ?? false) {
        _events.remove(_selectedDay);
      }
    });
  }
}

class CollectionEvent {
  final String type;
  final String time;
  final List<String> bins;

  CollectionEvent({required this.type, required this.time, required this.bins});
}
