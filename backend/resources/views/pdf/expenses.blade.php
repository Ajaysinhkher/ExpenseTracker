<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Expenses Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        h2 { margin-top: 30px; }
    </style>
</head>
<body>
    <h1>Expense Report for {{ $user }}</h1>

    @foreach($groups as $group)
        <h2>Group: {{ $group['name'] }}</h2>
        @if(count($group['expenses']) > 0)
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                @foreach($group['expenses'] as $expense)
                    <tr>
                        <td>{{ $expense['description'] }}</td>
                        <td>{{ $expense['amount'] }}</td>
                        <td>{{ $expense['date'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        @else
            <p>No expenses in this group.</p>
        @endif
    @endforeach
</body>
</html>
